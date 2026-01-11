"""MCP Document tools for Mindrian agent.

These tools call back to Phoenix REST API endpoints for document operations.
Uses session context for user_id and workspace_id.

Confirmable tools (create, edit, delete) are protected by the PreToolUse hook
in claude_agent_service.py which handles the confirmation flow.
"""

import json
import logging
import os
from typing import Any

import httpx
from claude_agent_sdk import tool

logger = logging.getLogger(__name__)

PHOENIX_URL = os.getenv("PHOENIX_URL", "http://localhost:4000")

# Session context storage
_session_context: dict[str, dict[str, str]] = {}

# Current session ID (set by the service layer before each request)
current_session_id: str = ""


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


@tool("search_documents", "Search documents by title", {"query": str})
async def search_documents(args: dict[str, Any]) -> dict[str, Any]:
    """Search documents by title in the user's workspace.

    Args:
        query: Search query to match against document titles

    Returns:
        List of matching documents with document_id, title, created_at, and updated_at
    """
    try:
        result = await _phoenix_request(
            "/api/agent/tools/search_documents",
            {"query": args["query"]},
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to search documents: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool("get_workspace_summary", "Get a summary of the current workspace", {})
async def get_workspace_summary(args: dict[str, Any]) -> dict[str, Any]:
    """Get a summary of the current workspace.

    Returns workspace metadata, document/folder counts, and recent activity.

    Returns:
        Workspace summary with name, counts, and recent documents
    """
    try:
        result = await _phoenix_request("/api/agent/tools/get_workspace_summary", {})
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to get workspace summary: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "create_document",
    "Create a new document. Confirmation is built-in, so call directly without asking.",
    {"title": str},
)
async def create_document(args: dict[str, Any]) -> dict[str, Any]:
    """Create a new document in the user's workspace.

    Confirmation is handled by the PreToolUse hook before this runs.

    Args:
        title: The title for the new document

    Returns:
        Document creation result with document_id and title
    """
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
    """Edit a document with block operations. Confirmation is built-in, call directly.

Block types: paragraph, heading, bulletListItem, numberedListItem, checkListItem, codeBlock, quote

Block props by type:
- heading: level (1-6, default 1)
- checkListItem: checked (true/false, default false)
- codeBlock: language (string, default "text")
- all blocks: textAlignment ("left", "center", "right")

Operations:
- append_block: Add block at end of document
- insert_block: Add block after specific block_id (use after_id)
- update_block: Modify existing block content/props (use block_id)
- delete_block: Remove block (use block_id)
- convert_block: Change block type preserving content (use block_id, to_type, props)

Examples:
- Heading: {"type": "append_block", "block": {"type": "heading", "props": {"level": 2}}}
- Checkbox: {"type": "append_block", "block": {"type": "checkListItem", "props": {"checked": true}}}
- Code: {"type": "append_block", "block": {"type": "codeBlock", "props": {"language": "python"}}}
- Convert: {"type": "convert_block", "block_id": "abc", "to_type": "heading"}""",
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
                                "convert_block",
                            ],
                            "description": "Operation type",
                        },
                        "block_id": {
                            "type": "string",
                            "description": "Block ID for delete_block, update_block, convert_block",
                        },
                        "after_id": {
                            "type": "string",
                            "description": "Block ID to insert after for insert_block",
                        },
                        "to_type": {
                            "type": "string",
                            "description": "Target block type for convert_block",
                        },
                        "block": {
                            "type": "object",
                            "description": "Block data for insert_block and append_block",
                            "properties": {
                                "type": {
                                    "type": "string",
                                    "enum": [
                                        "paragraph",
                                        "heading",
                                        "bulletListItem",
                                        "numberedListItem",
                                        "checkListItem",
                                        "codeBlock",
                                        "quote",
                                    ],
                                },
                                "props": {
                                    "type": "object",
                                    "properties": {
                                        "level": {
                                            "type": "integer",
                                            "minimum": 1,
                                            "maximum": 6,
                                        },
                                        "checked": {"type": "boolean"},
                                        "language": {"type": "string"},
                                        "textAlignment": {
                                            "type": "string",
                                            "enum": ["left", "center", "right"],
                                        },
                                    },
                                },
                                "content": {"type": "string"},
                            },
                        },
                        "props": {
                            "type": "object",
                            "description": "Props for update_block or convert_block",
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

    Confirmation is handled by the PreToolUse hook before this runs.
    """
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
    "open_document",
    "Open a document in the user's editor. Use this to show the user a relevant document.",
    {"document_id": str},
)
async def open_document(args: dict[str, Any]) -> dict[str, Any]:
    """Open a document in the user's editor.

    This signals the frontend to open and display the specified document.
    Use this when you want to show the user a document that's relevant to the conversation.

    Args:
        document_id: The ID of the document to open

    Returns:
        Confirmation with document_id and title
    """
    try:
        result = await _phoenix_request(
            "/api/agent/tools/open_document",
            {"document_id": args["document_id"]},
        )
        return _format_success(result)
    except httpx.HTTPStatusError as e:
        return _format_error(f"Failed to open document: {e.response.text}")
    except Exception as e:
        return _format_error(f"Error: {e}")


@tool(
    "delete_document",
    "Delete a document. Confirmation is built-in, so call directly without asking.",
    {"document_id": str},
)
async def delete_document(args: dict[str, Any]) -> dict[str, Any]:
    """Delete a document from the user's workspace.

    Confirmation is handled by the PreToolUse hook before this runs.
    This action cannot be undone.

    Args:
        document_id: The ID of the document to delete

    Returns:
        Deletion confirmation with deleted status and document_id
    """
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
