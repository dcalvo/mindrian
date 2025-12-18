"""Document tools for Mindrian agent.

These tools call back to Phoenix REST API endpoints for document operations.
Uses user_id from RunContext - internal network only, no auth needed.
"""

import os
from typing import Any, Optional

import httpx
from agno.run import RunContext
from agno.tools import tool

PHOENIX_URL = os.getenv("PHOENIX_URL", "http://localhost:4000")


def _phoenix_request(
    endpoint: str,
    payload: dict[str, Any],
    run_context: Optional[RunContext],
) -> dict[str, Any]:
    """Make request to Phoenix tool endpoint with user_id."""
    user_id = run_context.user_id if run_context else None
    response = httpx.post(
        f"{PHOENIX_URL}{endpoint}",
        json={**payload, "user_id": user_id},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()


@tool(requires_confirmation=True)
def create_document(title: str, run_context: Optional[RunContext] = None) -> dict[str, Any]:
    """Create a new document in the user's workspace.

    Args:
        title: The title for the new document

    Returns:
        Document creation result with document_id and title
    """
    return _phoenix_request(
        "/api/agent/tools/create_document",
        {"title": title},
        run_context,
    )


@tool
def read_document(document_id: str, run_context: Optional[RunContext] = None) -> dict[str, Any]:
    """Read the content of a document.

    Returns the document's blocks as structured data including title and all content blocks.

    Args:
        document_id: The ID of the document to read

    Returns:
        Document content with document_id, title, and blocks
    """
    return _phoenix_request(
        "/api/agent/tools/read_document",
        {"document_id": document_id},
        run_context,
    )


@tool(requires_confirmation=True)
def edit_document(
    document_id: str,
    operations: list[dict[str, Any]],
    run_context: Optional[RunContext] = None,
) -> dict[str, Any]:
    """Edit a document by applying block-level operations.

    Operations are applied in order. Available operation types:
    - insert_block: Insert a new block after a specified block (or at start if no after_id)
    - delete_block: Remove a block by ID
    - update_block: Update the content of an existing block
    - append_block: Add a new block at the end of the document

    Args:
        document_id: The ID of the document to edit
        operations: List of operations to apply. Each operation has:
            - type: One of "insert_block", "delete_block", "update_block", "append_block"
            - block_id: The ID of the block (for delete_block and update_block)
            - after_id: The ID of the block to insert after (for insert_block)
            - block: Block data with type and content (for insert_block and append_block)
            - content: New content for the block (for update_block)

    Returns:
        Edit result with document_id and operations_applied count
    """
    return _phoenix_request(
        "/api/agent/tools/edit_document",
        {"document_id": document_id, "operations": operations},
        run_context,
    )


@tool(requires_confirmation=True)
def delete_document(document_id: str, run_context: Optional[RunContext] = None) -> dict[str, Any]:
    """Delete a document from the user's workspace.

    This action cannot be undone.

    Args:
        document_id: The ID of the document to delete

    Returns:
        Deletion confirmation with deleted status and document_id
    """
    return _phoenix_request(
        "/api/agent/tools/delete_document",
        {"document_id": document_id},
        run_context,
    )


# Export all document tools
document_tools = [create_document, read_document, edit_document, delete_document]
