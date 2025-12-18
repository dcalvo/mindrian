# MVP Chat Panel Implementation Plan

## Overview

Implement an AI chat panel that can read and modify user documents using the Anthropic Claude API, with tool approval flow similar to Claude Code.

## Scope Decisions

- **LLM**: Anthropic Claude API
- **Tool approval**: Always require user approval before execution
- **Chat history**: Per-session only (no DB persistence)
- **Document access**: Any user document (scoped by ownership)
- **Document context**: Auto-include currently open document in agent context
- **Edit granularity**: Block-level operations (BlockNote blocks)
- **Tools**: `create_document`, `delete_document`, `read_document`, `edit_document`
- **Agent backend**: Elixir/Phoenix (not Python microservice)

### Why Elixir for Agent Backend

Considered Python microservice for better AI ecosystem (official Anthropic SDK, langchain, etc.), but chose Elixir for MVP because:

1. **Simpler deployment** - Single codebase, no service-to-service communication
2. **Native WebSocket integration** - Phoenix channels already handle real-time
3. **GenServers for sessions** - Elixir's concurrency model is ideal for agent state
4. **Sufficient for MVP** - Anthropic API is straightforward HTTP; Req handles it fine
5. **Uses existing patterns** - Auth/scope, channel broadcasting already in place

Can revisit Python microservice later if agent logic becomes complex (RAG, embeddings, multi-step reasoning).

## Architecture

```
Frontend (ChatPane)          Backend
        |                       |
        |-- user_message ------>|  ChatChannel (chat:{user_id})
        |                       |       |
        |                       |  AgentServer (GenServer, per-session)
        |                       |       |
        |                       |  Anthropic API call
        |                       |       |
        |<-- tool_request ------|  (if tool use detected)
        |                       |
        |-- tool_response ----->|  (user approves/rejects)
        |                       |       |
        |                       |  Execute tool via Documents ctx / DocServer
        |                       |       |
        |<-- tool_result -------|
        |<-- assistant_message -|
```

## Backend Changes

### New Files

| File | Purpose |
|------|---------|
| `lib/mindrian/agent/anthropic.ex` | HTTP client for Claude API using Req |
| `lib/mindrian/agent/tools.ex` | Tool definitions and execution logic |
| `lib/mindrian/agent/agent_server.ex` | GenServer managing agent conversation |
| `lib/mindrian_web/channels/chat_channel.ex` | Phoenix channel for chat WebSocket |

### Files to Modify

| File | Changes |
|------|---------|
| `lib/mindrian_web/channels/user_socket.ex` | Add `channel "chat:*", ChatChannel` |
| `lib/mindrian/application.ex` | Add `Registry` for AgentServer processes |
| `lib/mindrian/collaboration/yjs_persistence.ex` | Make `get_y_doc/1` public |
| `lib/mindrian/collaboration/doc_server.ex` | Add `handle_call` for agent edits |
| `config/runtime.exs` | Add `ANTHROPIC_API_KEY` config |

### Channel Messages

**Client -> Server:**
```elixir
# Send user message (context auto-included from currently open doc)
"user_message" -> %{content: string, context: %{document_id: string | nil}}

# Respond to tool request
"tool_response" -> %{request_id: string, approved: boolean}

# Cancel operation
"cancel" -> %{}
```

**Server -> Client:**
```elixir
# Assistant response
"assistant_message" -> %{content: string}

# Tool needs approval
"tool_request" -> %{request_id: string, tool_name: string, tool_input: map, description: string}

# Tool executed
"tool_result" -> %{request_id: string, success: boolean, result?: any, error?: string}

# Status update
"agent_status" -> %{status: "thinking" | "awaiting_approval" | "executing" | "idle"}
```

### Tool Definitions

```elixir
# create_document
%{name: "create_document", input: %{title: string}}
# Execution: Documents.create_document(scope, %{title: title})

# delete_document
%{name: "delete_document", input: %{document_id: string}}
# Execution: Documents.delete_document(doc) after scope check

# read_document
%{name: "read_document", input: %{document_id: string}}
# Execution: YjsPersistence.get_y_doc(doc_id) -> extract blocks from XmlFragment

# edit_document (block-level operations)
%{name: "edit_document", input: %{
  document_id: string,
  operations: [
    %{type: "insert_block", after_id?: string, block: %{type: string, content: string}},
    %{type: "delete_block", block_id: string},
    %{type: "update_block", block_id: string, content: string},
    %{type: "append_block", block: %{type: string, content: string}}
  ]
}}
# Execution: DocServer.apply_block_operations(doc_id, operations)
```

### DocServer Extension

Add to `doc_server.ex`:
```elixir
def handle_call({:apply_block_operations, operations}, _from, state) do
  # Apply block-level edits to state.doc XmlFragment ("document-store")
  # Operations: insert_block, delete_block, update_block, append_block
  # handle_update_v1 callback auto-persists and broadcasts
  {:reply, :ok, state}
end

def apply_block_operations(doc_id, operations) do
  # Lookup or start DocServer, then call
end

def handle_call(:get_blocks, _from, state) do
  # Extract block structure from XmlFragment for read_document
  {:reply, blocks, state}
end
```

Note: BlockNote stores blocks in Yjs XmlFragment. Need to understand BlockNote's internal block structure to manipulate correctly.

## Frontend Changes

### New Files

| File | Purpose |
|------|---------|
| `src/contexts/ChatContext.tsx` | Chat state provider with channel connection |
| `src/hooks/useChat.ts` | Hook to access chat context |
| `src/components/ChatMessage.tsx` | Render user/assistant messages |
| `src/components/ToolApproval.tsx` | Tool request approval UI |
| `src/components/ChatPane.css` | Chat styling |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/ChatPane.tsx` | Full rewrite with message list, input, tool approval |
| `src/components/RootLayout.tsx` | Wrap with `<ChatProvider>` |

### ChatContext State

```typescript
interface ChatContextValue {
  messages: ChatMessage[];
  pendingTool: ToolRequest | null;
  status: "idle" | "thinking" | "awaiting_approval" | "executing";
  sendMessage: (content: string) => void;  // Auto-includes current doc context
  approveToolRequest: (requestId: string) => void;
  rejectToolRequest: (requestId: string) => void;
  cancel: () => void;
}

// ChatProvider reads current document from route params and auto-includes in messages
```

### ChatPane UI Structure

```
+---------------------------+
| Chat                      |
+---------------------------+
| [Messages list]           |
|   User: ...               |
|   Assistant: ...          |
|   [Tool Request Card]     |
|     create_page           |
|     title: "New doc"      |
|     [Approve] [Reject]    |
|   Assistant: ...          |
+---------------------------+
| [Status: thinking...]     |
| [Input] [Send]            |
+---------------------------+
```

## Implementation Order

### Phase 1: Backend Agent Core
1. Create `lib/mindrian/agent/anthropic.ex` - Req HTTP client for Claude
2. Create `lib/mindrian/agent/tools.ex` - tool definitions (no execution yet)
3. Create `lib/mindrian/agent/agent_server.ex` - GenServer with message loop
4. Add AgentServerRegistry to `application.ex`
5. Add ANTHROPIC_API_KEY to `config/runtime.exs`
6. Test in IEx: `AgentServer.send_message(pid, "Hello")`

### Phase 2: Channel Integration
1. Create `lib/mindrian_web/channels/chat_channel.ex`
2. Add routing in `user_socket.ex`
3. Wire channel to AgentServer
4. Test via browser console WebSocket

### Phase 3: Tool Execution
1. Make `YjsPersistence.get_y_doc/1` public
2. Implement `create_document` execution in `tools.ex`
3. Implement `delete_document` execution
4. Implement `read_document` execution
5. Add `apply_block_operations` to `doc_server.ex`
6. Implement `edit_document` execution
7. Test tools via IEx

### Phase 4: Frontend Chat UI
1. Create `ChatContext.tsx` following DocumentsContext pattern
2. Create `useChat.ts` hook
3. Rewrite `ChatPane.tsx` with message list and input
4. Create `ChatMessage.tsx` component
5. Create `ToolApproval.tsx` component
6. Add `ChatPane.css` styling
7. Integrate ChatProvider in `RootLayout.tsx`

### Phase 5: Integration & Polish
1. End-to-end testing of full flow
2. Error handling (API failures, tool errors)
3. Loading states and status indicators
4. Edge case handling (disconnect, cancel mid-tool)

## Open Questions / Edge Cases

1. **Concurrent edits**: If user and agent edit simultaneously, Yjs handles merging, but UI might be confusing - MVP can accept this
2. **Error recovery**: If tool execution fails, agent reports error to user (no auto-retry for MVP)
3. **Rate limiting**: MVP can skip, production needs limits on API calls
4. **BlockNote structure**: Need to investigate how BlockNote stores blocks in Yjs XmlFragment to implement block operations correctly

## Resolved Decisions

- **Document context**: Auto-include currently open document in agent context
- **Edit granularity**: Block-level operations (insert, delete, update, append blocks)

## Environment Setup

```bash
# Add to .env
ANTHROPIC_API_KEY=sk-ant-...
```

## Critical File Paths

**Backend:**
- `backend/lib/mindrian/collaboration/doc_server.ex` - Yjs doc management
- `backend/lib/mindrian/collaboration/yjs_persistence.ex` - Doc persistence
- `backend/lib/mindrian/documents.ex` - Documents context
- `backend/lib/mindrian_web/channels/user_socket.ex` - Channel routing

**Frontend:**
- `frontend/src/components/ChatPane.tsx` - Chat UI
- `frontend/src/contexts/DocumentsContext.tsx` - Pattern to follow
- `frontend/src/lib/socket.ts` - WebSocket helpers
