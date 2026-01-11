# Claude Agent Service

FastAPI microservice that wraps the Claude Agent SDK to provide AI assistant capabilities for Mindrian.

## Architecture

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│  React Frontend │◄──────────────────►│  Phoenix Backend │
└─────────────────┘                    └────────┬────────┘
                                                │
                                          HTTP/SSE
                                                │
                                       ┌────────▼────────┐
                                       │  Claude Agent   │
                                       │    Service      │
                                       │   (this code)   │
                                       └────────┬────────┘
                                                │
                                          Claude SDK
                                                │
                                       ┌────────▼────────┐
                                       │  Anthropic API  │
                                       └─────────────────┘
```

The service acts as a bridge between Phoenix and the Claude Agent SDK:
1. Phoenix sends user messages via HTTP POST
2. This service streams SSE events back (text chunks, tool calls, etc.)
3. Tool results are fetched from Phoenix via HTTP callbacks

## Running the Service

```bash
# Development (with auto-reload)
uv run uvicorn claude_agent_service:app --port 8001 --reload

# Or directly
uv run python claude_agent_service.py
```

Requires `ANTHROPIC_API_KEY` environment variable (loaded from `.env`).

## Available Tools

### MCP Document Tools (require Phoenix backend)

| Tool | Description | Confirmation |
|------|-------------|--------------|
| `list_documents` | List all documents in workspace | No |
| `search_documents` | Search documents by title | No |
| `get_workspace_summary` | Get workspace overview | No |
| `read_document` | Read document content | No |
| `create_document` | Create new document | **Yes** |
| `edit_document` | Edit document blocks | **Yes** |
| `delete_document` | Delete document | **Yes** |

### Built-in Claude Tools

| Tool | Description | Confirmation |
|------|-------------|--------------|
| `WebSearch` | Search the web | No (auto-approved) |
| `WebFetch` | Fetch and summarize URL content | No (auto-approved) |
| `Task` | Spawn subagents | No |

### Subagents

| Agent | Description | Tools | Model |
|-------|-------------|-------|-------|
| `explore` | Deep workspace exploration | read-only document tools | haiku |
| `larry` | PWS thinking partner for formalizing ideas/problems | none (pure thinking) | opus |

The explore agent is invoked via the Task tool when users ask exploratory questions like "what do I have about X?" It thoroughly searches documents and returns a comprehensive summary.

The larry agent is invoked when users explicitly ask for help thinking through something (e.g., "help me think through this idea"). Larry uses the PWS (Problems Worth Solving) methodology to guide users from vague uncertainty to crystallized clarity through Socratic questioning. When clarity is reached, the main agent offers to save the formalized problem as a structured document.

## API Endpoints

### `POST /agents/mindrian-claude/runs`

Start a new agent run with SSE streaming.

**Form Parameters:**
- `message` (required): User's message
- `session_id` (required): Conversation ID for continuity
- `user_id` (required): User ID for Phoenix callbacks
- `workspace_id` (optional): Workspace context
- `stream` (required): Must be `true`

**SSE Events:**
- `RunStarted` - Agent run began
- `TextChunk` - Streaming text content
- `TextEnd` - Text streaming finished
- `ToolStarted` - Tool execution began
- `ToolCompleted` - Tool finished successfully
- `ToolFailed` - Tool execution failed
- `RunPaused` - Waiting for tool confirmation
- `RunCompleted` - Agent run finished
- `RunError` - Error occurred

### `POST /agents/mindrian-claude/runs/{run_id}/continue`

Continue a paused run after user confirms/rejects tool calls.

**Form Parameters:**
- `tool_decisions`: JSON array of `{tool_call_id, confirmed: bool}`
- `session_id`, `user_id`, `workspace_id`: Same as create_run

### `POST /agents/mindrian-claude/runs/{run_id}/cancel`

Cancel an in-progress run.

### `GET /health`

Health check endpoint.

## Tool Confirmation Flow

Some tools require user confirmation before executing (create, edit, delete operations):

```
1. SDK calls MCP tool
2. Tool calls request_confirmation()
3. Service emits RunPaused SSE event
4. Frontend shows confirmation UI
5. User approves/rejects
6. Phoenix calls /continue endpoint
7. resolve_tool_confirmation() unblocks the tool
8. Tool executes (or returns rejection error)
9. SDK continues processing
```

This is implemented using `asyncio.Event` for async waiting and a callback mechanism to emit SSE events from within MCP tool handlers.

## Session Management

Sessions are identified by `session_id` (typically the conversation UUID from Phoenix).

Each session maintains:
- `sdk_session_id`: Claude SDK session for conversation continuity
- `user_id` / `workspace_id`: Context for Phoenix callbacks
- `run_id`: Current run identifier
- Event queue for SSE streaming

The SDK's `resume` feature maintains conversation history across HTTP requests.

## Adding New Tools

### MCP Tools (Phoenix-backed)

1. Add tool function in `mcp_tools/documents.py`:
```python
@tool("tool_name", "Description", {"param": str})
async def tool_name(args: dict[str, Any]) -> dict[str, Any]:
    # For confirmable tools:
    approved = await request_confirmation("mcp__mindrian__tool_name", args)
    if not approved:
        return _format_error("User rejected")

    result = await _phoenix_request("/api/agent/tools/tool_name", args)
    return _format_success(result)
```

2. Add Phoenix endpoint in `backend/lib/mindrian_web/controllers/api/agent_tools_controller.ex`

3. Register in `claude_agent_service.py`:
   - Import the tool
   - Add to `mindrian_mcp` tools list
   - Add to `allowed_tools` in `get_client_options()`

### Built-in Claude Tools

Just add the tool name to `allowed_tools`:
```python
allowed_tools=[
    # ...existing tools...
    "NewBuiltinTool",
]
```

Available built-in tools: `WebSearch`, `WebFetch`, `Task`, `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, etc.

### Subagents

Define in `claude_agent_service.py`:
```python
MY_AGENT = AgentDefinition(
    description="When to use this agent",
    prompt="Agent's system prompt...",
    tools=["list", "of", "allowed", "tools"],
    model="haiku",  # or "sonnet", "opus", "inherit"
)
```

Add to options:
```python
agents={"my-agent": MY_AGENT}
```

## Important Gotchas

### 1. Fresh Client Per Request

Each HTTP request creates a new `ClaudeSDKClient` instance. Conversation continuity is maintained via the SDK's `resume` feature using stored `sdk_session_id`. This avoids state corruption issues with long-lived clients.

### 2. Don't Cancel Message Tasks

In `translate_and_stream_messages()`, we intentionally don't cancel `pending_message_task` on cleanup. Cancelling it can corrupt the SDK's internal state. Let the SDK handle its own cleanup.

### 3. Tool Confirmation is Async

The `request_confirmation()` function uses `asyncio.Event` to block until the user responds. The SSE event queue runs concurrently with the message stream so pause events can be emitted even while the SDK is blocked.

### 4. MCP Tool Naming Convention

MCP tools are prefixed with `mcp__{server}__{tool}`:
- `mcp__mindrian__list_documents`
- `mcp__mindrian__create_document`

This prefix is required in `allowed_tools` and subagent tool lists.

### 5. WebFetch Timeout

The built-in `WebFetch` tool has a ~30-60 second timeout that cannot be configured. Some sites with anti-bot protection may cause it to hang until timeout.

### 6. Subagents Can't Spawn Subagents

Don't include `Task` in a subagent's tools list. Subagents cannot spawn their own subagents.

### 7. Session Context for MCP Tools

MCP tools need session context (user_id, workspace_id) to make Phoenix callbacks. This is set via:
```python
set_session_context(session_id, user_id, workspace_id)
documents.current_session_id = session_id
```

Both must be set before tools execute.

## File Structure

```
claude_agent/
├── claude_agent_service.py  # Main FastAPI service
├── mcp_tools/
│   ├── __init__.py
│   └── documents.py         # MCP tool implementations
├── pyproject.toml           # Python dependencies
└── README.md                # This file
```

## Dependencies

- `claude-agent-sdk`: Anthropic's agent SDK
- `fastapi`: Web framework
- `sse-starlette`: Server-sent events
- `httpx`: Async HTTP client (for Phoenix callbacks)
- `python-dotenv`: Environment variable loading
