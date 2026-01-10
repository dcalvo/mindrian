"""Claude Agent Service - FastAPI service wrapping Claude Agent SDK.

Provides SSE-streaming endpoints for the Phoenix backend to communicate with
Claude Agent SDK, matching the event format expected by the Mindrian Driver.

Run with:
    uv run uvicorn claude_agent_service:app --port 8001 --reload
"""

import asyncio
import json
import logging
import os
import traceback
import uuid
from typing import Any

from dotenv import load_dotenv
from fastapi import FastAPI, Form, HTTPException
from sse_starlette.sse import EventSourceResponse

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

from claude_agent_sdk import (  # noqa: E402
    AssistantMessage,
    ClaudeAgentOptions,
    ClaudeSDKClient,
    ResultMessage,
    SystemMessage,
    ToolResultBlock,
    ToolUseBlock,
    UserMessage,
    create_sdk_mcp_server,
)
from claude_agent_sdk.types import StreamEvent  # noqa: E402

from mcp_tools.documents import (  # noqa: E402
    create_document,
    delete_document,
    edit_document,
    list_documents,
    read_document,
    resolve_tool_confirmation,
    set_emit_pause_callback,
    set_session_context,
)

app = FastAPI(title="Mindrian Claude Agent", version="0.1.0")

# Session storage for ClaudeSDKClient instances
# Key: session_id (conversation_id), Value: dict with client and state
_sessions: dict[str, dict[str, Any]] = {}

# System prompt for the Mindrian agent
SYSTEM_PROMPT = """You are a helpful AI assistant for Mindrian, a deep-research \
platform for uncovering non-obvious connections.

You can help users:
- Create new documents to organize their research
- Read and understand document content
- Edit documents by adding, updating, or removing content blocks
- Delete documents when no longer needed

When working with documents:
- Use read_document to understand what's already in a document before making changes
- Use edit_document with appropriate operations to make changes
- Be precise with block operations - you can insert, update, delete, or append blocks
- Confirm destructive actions like deleting documents
- You can use **bold** markdown formatting in document content
- For headings, use the "heading" block type instead of markdown # symbols

Be concise and helpful. Focus on assisting the user with their research and \
document management tasks."""

# Create the MCP server with document tools
mindrian_mcp = create_sdk_mcp_server(
    name="mindrian",
    version="1.0.0",
    tools=[list_documents, create_document, read_document, edit_document, delete_document],
)

# SSE event queues for each session - used to emit pause events from MCP tools
_session_event_queues: dict[str, asyncio.Queue] = {}

def emit_pause_event(
    session_id: str,
    tool_use_id: str,
    tool_name: str,
    tool_args: dict[str, Any],
) -> str | None:
    """Emit a RunPaused event to the session's SSE stream.

    Called by MCP tools when they need user confirmation.
    Returns the tool_call_id used.
    """
    logger.info(f"Emitting pause event: session={session_id}, tool={tool_name}")

    if session_id not in _session_event_queues:
        logger.warning(f"No event queue for session {session_id}")
        return None

    run_id = _sessions.get(session_id, {}).get("run_id", "unknown")
    pause_event = format_sse_event(
        "RunPaused",
        {
            "run_id": run_id,
            "tools": [
                {
                    "tool_call_id": tool_use_id,
                    "tool_name": tool_name,
                    "tool_args": tool_args,
                }
            ],
        },
    )

    # Put the event in the queue (synchronously)
    try:
        _session_event_queues[session_id].put_nowait(pause_event)
    except Exception as e:
        logger.error(f"Failed to emit pause event: {e}")

    return tool_use_id


# Set the callback for MCP tools to emit pause events
set_emit_pause_callback(emit_pause_event)


def get_client_options(sdk_session_id: str | None = None) -> ClaudeAgentOptions:
    """Create ClaudeAgentOptions for a new client.

    Args:
        sdk_session_id: If provided, resume this SDK session for conversation continuity
    """
    return ClaudeAgentOptions(
        system_prompt=SYSTEM_PROMPT,
        mcp_servers={"mindrian": mindrian_mcp},
        allowed_tools=[
            "mcp__mindrian__list_documents",
            "mcp__mindrian__create_document",
            "mcp__mindrian__read_document",
            "mcp__mindrian__edit_document",
            "mcp__mindrian__delete_document",
        ],
        include_partial_messages=True,  # For streaming chunks
        resume=sdk_session_id,  # Resume previous conversation if provided
    )


async def create_client_for_request(
    session_id: str, user_id: str, workspace_id: str
) -> tuple[ClaudeSDKClient, dict]:
    """Create a fresh SDK client for a request.

    Uses the SDK's resume feature to maintain conversation continuity.
    Each HTTP request gets a fresh client to avoid state corruption issues.

    Returns:
        Tuple of (client, session_data)
    """
    # Get or create session data (does NOT include the client)
    if session_id not in _sessions:
        logger.info(f"Creating new session data for session_id={session_id}")
        _sessions[session_id] = {
            "sdk_session_id": None,  # Will be set after first response
            "user_id": user_id,
            "workspace_id": workspace_id,
            "run_id": None,
        }
        # Create event queue for this session
        _session_event_queues[session_id] = asyncio.Queue()
        # Set context for MCP tools
        set_session_context(session_id, user_id, workspace_id)
    else:
        logger.info(f"Continuing session for session_id={session_id}")
        # Clear any stale events from the queue
        queue = _session_event_queues.get(session_id)
        if queue:
            while not queue.empty():
                try:
                    queue.get_nowait()
                except asyncio.QueueEmpty:
                    break

    session_data = _sessions[session_id]
    sdk_session_id = session_data.get("sdk_session_id")

    # Create fresh client, resuming if we have a previous SDK session
    logger.debug(f"ANTHROPIC_API_KEY set: {bool(os.getenv('ANTHROPIC_API_KEY'))}")
    options = get_client_options(sdk_session_id=sdk_session_id)
    if sdk_session_id:
        logger.info(f"Resuming SDK session: {sdk_session_id}")
    logger.debug(f"Client options: {options}")

    client = ClaudeSDKClient(options=options)
    logger.info("ClaudeSDKClient created, connecting...")

    await client.connect()
    logger.info("ClaudeSDKClient connected successfully")

    return client, session_data


def update_sdk_session_id(session_id: str, sdk_session_id: str):
    """Store the SDK session ID for future resume."""
    if session_id in _sessions:
        _sessions[session_id]["sdk_session_id"] = sdk_session_id
        logger.info(f"Stored SDK session ID: {sdk_session_id}")


async def cleanup_session(session_id: str):
    """Clean up a session."""
    if session_id in _sessions:
        _sessions.pop(session_id)
    if session_id in _session_event_queues:
        _session_event_queues.pop(session_id)


def format_sse_event(event_type: str, data: dict) -> dict:
    """Format an SSE event in the Mindrian driver format."""
    return {"event": event_type, "data": json.dumps(data)}


async def translate_and_stream_messages(
    client: ClaudeSDKClient,
    run_id: str,
    session_id: str,
):
    """Translate Claude SDK messages to Mindrian SSE events.

    Uses asyncio.wait to monitor both the SDK message stream AND the event queue
    concurrently. This allows pause events from MCP tools to be yielded even while
    the SDK is blocked waiting for a tool to complete.
    """
    logger.info(f"translate_and_stream_messages started for run_id={run_id}")
    text_started = False
    event_queue = _session_event_queues.get(session_id)

    # Get async iterator from client
    message_iter = client.receive_response().__aiter__()
    pending_message_task: asyncio.Task | None = None
    pending_queue_task: asyncio.Task | None = None
    stream_done = False

    async def get_next_message():
        return await message_iter.__anext__()

    async def get_next_queue_event():
        return await event_queue.get()

    try:
        logger.debug("Starting to iterate over client.receive_response()...")

        while not stream_done:
            # Create tasks for message stream and queue if not already pending
            if pending_message_task is None and not stream_done:
                pending_message_task = asyncio.create_task(get_next_message())

            if pending_queue_task is None and event_queue:
                pending_queue_task = asyncio.create_task(get_next_queue_event())

            # Wait for either a message or a queue event
            tasks = [t for t in [pending_message_task, pending_queue_task] if t]
            if not tasks:
                break

            done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)

            for task in done:
                if task is pending_queue_task:
                    # Queue event (like RunPaused) - yield it immediately
                    pending_queue_task = None
                    queued_event = task.result()
                    logger.debug(f"Yielding queued event: {queued_event}")
                    yield queued_event

                elif task is pending_message_task:
                    # SDK message - process and possibly yield events
                    pending_message_task = None
                    try:
                        message = task.result()
                    except StopAsyncIteration:
                        # Message stream is done
                        logger.info("Message stream completed")
                        stream_done = True
                        continue

                    # Process the message and yield appropriate events
                    async for event in process_message(message, run_id, session_id, text_started):
                        # Update text_started state based on events
                        if event.get("event") == "TextChunk" and not text_started:
                            text_started = True
                        elif event.get("event") == "TextEnd":
                            text_started = False
                        yield event

    except asyncio.CancelledError:
        logger.info("Stream cancelled by client disconnect")
        yield format_sse_event("RunCancelled", {})
        raise
    except Exception as e:
        logger.error(f"Error in translate_and_stream_messages: {e}")
        yield format_sse_event("RunError", {"content": str(e)})
    finally:
        # Clean up pending tasks without affecting the SDK client
        if pending_queue_task and not pending_queue_task.done():
            pending_queue_task.cancel()
            try:
                await pending_queue_task
            except asyncio.CancelledError:
                pass
        # Don't cancel pending_message_task - let the SDK handle its own cleanup
        # Cancelling it can corrupt the SDK's internal state


async def process_message(message, run_id: str, session_id: str, text_started: bool):
    """Process a single SDK message and yield SSE events."""
    # SystemMessage with init subtype
    if isinstance(message, SystemMessage):
        if message.subtype == "init":
            yield format_sse_event("RunStarted", {"run_id": run_id})

    # StreamEvent contains real-time streaming data
    elif isinstance(message, StreamEvent):
        event = message.event
        event_type = event.get("type", "")

        # Handle streaming text deltas
        if event_type == "content_block_delta":
            delta = event.get("delta", {})
            if delta.get("type") == "text_delta":
                text = delta.get("text", "")
                if text:
                    yield format_sse_event("TextChunk", {"content": text})

        # Handle content block stop (text stream ended)
        elif event_type == "content_block_stop":
            if text_started:
                yield format_sse_event("TextEnd", {})

    # AssistantMessage with content blocks (final assembled message)
    elif isinstance(message, AssistantMessage):
        # Handle tool use/result blocks from the final message
        for block in message.content:
            if isinstance(block, ToolUseBlock):
                # End any pending text
                if text_started:
                    yield format_sse_event("TextEnd", {})
                    text_started = False

                # Emit tool started
                yield format_sse_event(
                    "ToolStarted",
                    {
                        "tool_call_id": block.id,
                        "tool_name": block.name,
                        "tool_args": block.input,
                    },
                )

            elif isinstance(block, ToolResultBlock):
                if block.is_error:
                    yield format_sse_event(
                        "ToolFailed",
                        {
                            "tool_call_id": block.tool_use_id,
                            "error": str(block.content),
                        },
                    )
                else:
                    yield format_sse_event(
                        "ToolCompleted",
                        {
                            "tool_call_id": block.tool_use_id,
                            "result": block.content,
                        },
                    )

    # UserMessage with ToolResultBlock - tool execution completed
    elif isinstance(message, UserMessage):
        for block in message.content:
            if isinstance(block, ToolResultBlock):
                if block.is_error:
                    yield format_sse_event(
                        "ToolFailed",
                        {
                            "tool_call_id": block.tool_use_id,
                            "error": str(block.content),
                        },
                    )
                else:
                    yield format_sse_event(
                        "ToolCompleted",
                        {
                            "tool_call_id": block.tool_use_id,
                            "result": str(block.content) if block.content else "",
                        },
                    )

    # ResultMessage indicates completion
    elif isinstance(message, ResultMessage):
        # Store SDK session ID for conversation continuity
        if message.session_id:
            update_sdk_session_id(session_id, message.session_id)

        # End any pending text
        if text_started:
            yield format_sse_event("TextEnd", {})

        if message.is_error:
            yield format_sse_event("RunError", {"content": message.result or "Unknown error"})
        else:
            yield format_sse_event("RunCompleted", {})


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "agent": "mindrian-claude"}


@app.post("/agents/mindrian-claude/runs")
async def create_run(
    message: str = Form(...),
    stream: bool = Form(True),
    session_id: str = Form(...),
    user_id: str = Form(...),
    workspace_id: str = Form(None),
):
    """Start a new agent run with SSE streaming."""
    logger.info(f"create_run called: message={message[:50]}..., session_id={session_id}")

    if not stream:
        raise HTTPException(status_code=400, detail="Non-streaming mode not supported")

    run_id = str(uuid.uuid4())
    logger.info(f"Generated run_id={run_id}")

    async def event_generator():
        client = None
        try:
            logger.info(f"event_generator started for run_id={run_id}")

            # Create fresh client for this request (may resume previous conversation)
            client, session_data = await create_client_for_request(
                session_id, user_id, workspace_id or ""
            )
            session_data["run_id"] = run_id
            logger.info(f"Client ready: {client}")

            # Set current session for MCP tools
            from mcp_tools import documents

            documents.current_session_id = session_id

            # Send the query
            logger.info(f"Sending query: {message}")
            await client.query(message)
            logger.info("Query sent, starting to receive messages...")

            # Stream translated events
            async for event in translate_and_stream_messages(client, run_id, session_id):
                logger.debug(f"Yielding event: {event}")
                yield event

            logger.info("Event stream completed")

        except asyncio.CancelledError:
            logger.info("Client disconnected (CancelledError)")
            pass
        except Exception as e:
            logger.error(f"Error in event_generator: {e}")
            logger.error(traceback.format_exc())
            yield format_sse_event("RunError", {"content": str(e)})
        finally:
            # Always disconnect the client when done
            if client:
                try:
                    await client.disconnect()
                    logger.info("Client disconnected")
                except Exception as e:
                    logger.debug(f"Error disconnecting client: {e}")

    return EventSourceResponse(event_generator())


@app.post("/agents/mindrian-claude/runs/{run_id}/continue")
async def continue_run(
    run_id: str,
    tool_decisions: str = Form(...),
    session_id: str = Form(...),
    user_id: str = Form(...),
    workspace_id: str = Form(None),
):
    """Continue a paused run after tool approval/rejection."""
    logger.info(f"continue_run called: run_id={run_id}, session_id={session_id}")

    try:
        decisions = json.loads(tool_decisions)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid tool_decisions JSON")

    logger.info(f"Processing {len(decisions)} tool decisions")

    # Process each decision - this unblocks the can_use_tool callback
    for decision in decisions:
        tool_call_id = decision.get("tool_call_id")
        approved = decision.get("confirmed", False)
        logger.info(f"Decision: tool_call_id={tool_call_id}, approved={approved}")
        resolve_tool_confirmation(tool_call_id, approved)

    async def event_generator():
        yield format_sse_event("RunContinued", {})
        # The SDK will continue processing after can_use_tool returns
        # The main SSE stream from create_run will emit further events

    return EventSourceResponse(event_generator())


@app.post("/agents/mindrian-claude/runs/{run_id}/cancel")
async def cancel_run(run_id: str, session_id: str = Form(...)):
    """Cancel an in-progress run."""
    # Note: With the current architecture (fresh client per request), cancellation
    # would need to be implemented differently (e.g., via a cancellation flag).
    # For now, just cleanup the session.
    await cleanup_session(session_id)
    return {"status": "cancelled", "run_id": run_id}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("claude_agent_service:app", host="0.0.0.0", port=port, reload=True)
