"""MCP Document tools for Mindrian agent.

These tools call back to Phoenix REST API endpoints for document operations.
Uses session context for user_id and workspace_id.

Confirmable tools (create, edit, delete) will request user confirmation
before executing by emitting pause events to the service layer.
"""

import asyncio
import json
import logging
import os
import uuid
from typing import Any, Callable

import httpx
from claude_agent_sdk import tool

logger = logging.getLogger(__name__)

PHOENIX_URL = os.getenv("PHOENIX_URL", "http://localhost:4000")

# Session context storage
_session_context: dict[str, dict[str, str]] = {}

# Current session ID (set by the service layer before each request)
current_session_id: str = ""

# Pending confirmations: tool_use_id -> {event: asyncio.Event, approved: bool | None}
_pending_confirmations: dict[str, dict[str, Any]] = {}

# Callback to emit SSE events (set by service layer)
_emit_pause_callback: Callable[[str, str, str, dict[str, Any]], None] | None = None


def set_emit_pause_callback(callback: Callable[[str, str, str, dict[str, Any]], str | None]):
    """Set the callback function to emit pause events to the SSE stream.

    The callback returns the actual tool_call_id used (from SDK's ToolUseBlock).
    """
    global _emit_pause_callback
    _emit_pause_callback = callback


def resolve_tool_confirmation(tool_use_id: str, approved: bool):
    """Resolve a pending tool confirmation."""
    if tool_use_id in _pending_confirmations:
        _pending_confirmations[tool_use_id]["approved"] = approved
        _pending_confirmations[tool_use_id]["event"].set()
        logger.info(f"Resolved tool confirmation: {tool_use_id}, approved={approved}")
    else:
        logger.warning(f"No pending confirmation for tool_use_id={tool_use_id}")


async def request_confirmation(tool_name: str, tool_args: dict[str, Any]) -> bool:
    """Request user confirmation for a tool operation.

    Returns True if approved, False if denied.
    Raises TimeoutError if confirmation times out.
    """
    placeholder_id = str(uuid.uuid4())
    logger.info(f"Requesting confirmation for {tool_name}")

    # Emit pause event via callback - it returns the actual tool_call_id to use
    actual_tool_call_id = placeholder_id
    if _emit_pause_callback:
        returned_id = _emit_pause_callback(current_session_id, placeholder_id, tool_name, tool_args)
        if returned_id:
            actual_tool_call_id = returned_id
    else:
        logger.warning("No emit_pause_callback set, cannot request confirmation")
        return True  # Fall back to allowing if no callback

    logger.info(f"Using tool_call_id: {actual_tool_call_id}")

    # Create confirmation event with the actual tool_call_id
    confirmation_event = asyncio.Event()
    _pending_confirmations[actual_tool_call_id] = {
        "event": confirmation_event,
        "approved": None,
    }

    try:
        # Wait for confirmation (5 minute timeout)
        await asyncio.wait_for(confirmation_event.wait(), timeout=300)
        result = _pending_confirmations.get(actual_tool_call_id, {})
        return result.get("approved", False)
    except asyncio.TimeoutError:
        logger.warning(f"Confirmation timed out for {tool_name}")
        return False
    finally:
        _pending_confirmations.pop(actual_tool_call_id, None)


def set_session_context(session_id: str, user_id: str, workspace_id: str):
    """Set context for a session."""
    _session_context[session_id] = {
        "user_id": user_id,
        "workspace_id": workspace_id,
    }


def get_session_context(session_id: str) -> dict[str, str]:
    """Get context for a session."""
    return _session_context.get(session_id, {})


def clear_session_context(session_id: str):
    """Clear context for a session."""
    _session_context.pop(session_id, None)


async def _phoenix_request(endpoint: str, payload: dict[str, Any]) -> dict[str, Any]:
    """Make request to Phoenix tool endpoint with user_id and workspace_id."""
    ctx = get_session_context(current_session_id)
    user_id = ctx.get("user_id")
    workspace_id = ctx.get("workspace_id")

    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{PHOENIX_URL}{endpoint}",
            json={**payload, "user_id": user_id, "workspace_id": workspace_id},
            timeout=30.0,
        )
        response.raise_for_status()
        return response.json()


def _format_success(data: Any) -> dict[str, Any]:
    """Format a successful tool response."""
    if isinstance(data, dict):
        text = json.dumps(data, indent=2)
    else:
        text = str(data)
    return {"content": [{"type": "text", "text": text}]}


def _format_error(message: str) -> dict[str, Any]:
    """Format an error tool response."""
    return {"content": [{"type": "text", "text": message}], "is_error": True}


@tool("list_documents", "List all documents in the user's workspace", {})
async def list_documents(args: dict[str, Any]) -> dict[str, Any]:
    """List all documents in the user's workspace.

    Returns:
        List of documents with document_id, title, created_at, and updated_at
    """
    try:
        result = await _phoenix_request("/api/agent/tools/list_documents", {})
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to list documents: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "create_document",
    "Create a new document in the user's workspace",
    {"title": str},
)
async def create_document(args: dict[str, Any]) -> dict[str, Any]:
    """Create a new document in the user's workspace.

    Args:
        title: The title for the new document

    Returns:
        Document creation result with document_id and title
    """
    # Request user confirmation before creating
    approved = await request_confirmation(
        "mcp__mindrian__create_document",
        {"title": args["title"]},
    )
    if not approved:
        return _format_error("User rejected document creation")

    try:
        result = await _phoenix_request(
            "/api/agent/tools/create_document",
            {"title": args["title"]},
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to create document: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "read_document",
    "Read the content of a document",
    {"document_id": str},
)
async def read_document(args: dict[str, Any]) -> dict[str, Any]:
    """Read the content of a document.

    Returns the document's blocks as structured data including title and all content blocks.

    Args:
        document_id: The ID of the document to read

    Returns:
        Document content with document_id, title, and blocks
    """
    try:
        result = await _phoenix_request(
            "/api/agent/tools/read_document",
            {"document_id": args["document_id"]},
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to read document: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "edit_document",
    "Edit a document by applying block-level operations",
    {
        "type": "object",
        "properties": {
            "document_id": {"type": "string", "description": "The ID of the document to edit"},
            "operations": {
                "type": "array",
                "description": "List of operations to apply",
                "items": {
                    "type": "object",
                    "properties": {
                        "type": {
                            "type": "string",
                            "enum": [
                                "insert_block",
                                "delete_block",
                                "update_block",
                                "append_block",
                            ],
                            "description": "Operation type",
                        },
                        "block_id": {
                            "type": "string",
                            "description": "Block ID for delete_block and update_block",
                        },
                        "after_id": {
                            "type": "string",
                            "description": "Block ID to insert after for insert_block",
                        },
                        "block": {
                            "type": "object",
                            "description": "Block data for insert_block and append_block",
                        },
                        "content": {
                            "type": "string",
                            "description": "New content for update_block",
                        },
                    },
                    "required": ["type"],
                },
            },
        },
        "required": ["document_id", "operations"],
    },
)
async def edit_document(args: dict[str, Any]) -> dict[str, Any]:
    """Edit a document by applying block-level operations.

    Operations are applied in order. Available operation types:
    - insert_block: Insert a new block after a specified block (or at start if no after_id)
    - delete_block: Remove a block by ID
    - update_block: Update the content of an existing block
    - append_block: Add a new block at the end of the document

    Args:
        document_id: The ID of the document to edit
        operations: List of operations to apply

    Returns:
        Edit result with document_id and operations_applied count
    """
    # Request user confirmation before editing
    approved = await request_confirmation(
        "mcp__mindrian__edit_document",
        {
            "document_id": args["document_id"],
            "operations": args["operations"],
        },
    )
    if not approved:
        return _format_error("User rejected document edit")

    try:
        result = await _phoenix_request(
            "/api/agent/tools/edit_document",
            {
                "document_id": args["document_id"],
                "operations": args["operations"],
            },
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to edit document: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "delete_document",
    "Delete a document from the user's workspace (cannot be undone)",
    {"document_id": str},
)
async def delete_document(args: dict[str, Any]) -> dict[str, Any]:
    """Delete a document from the user's workspace.

    This action cannot be undone.

    Args:
        document_id: The ID of the document to delete

    Returns:
        Deletion confirmation with deleted status and document_id
    """
    # Request user confirmation before deleting
    approved = await request_confirmation(
        "mcp__mindrian__delete_document",
        {"document_id": args["document_id"]},
    )
    if not approved:
        return _format_error("User rejected document deletion")

    try:
        result = await _phoenix_request(
            "/api/agent/tools/delete_document",
            {"document_id": args["document_id"]},
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to delete document: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")
