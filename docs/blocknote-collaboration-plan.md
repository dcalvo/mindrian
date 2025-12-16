# BlockNote Collaboration - Status & Roadmap

## Current State

Basic collaborative editing is implemented and working:

- Real-time text sync between multiple clients via Yjs over Phoenix Channels
- Document persistence in PostgreSQL (append-only updates)
- Context-based architecture supporting multiple documents

### Architecture

```
Frontend                          Backend
────────                          ───────
CollaborationProvider             DocServer (Yex.DocServer)
  └─ caches Y.Doc per docId         └─ one GenServer per document
  └─ PhoenixChannelProvider         └─ broadcasts via PubSub

useCollaboration hook             YDocChannel
  └─ returns collaboration          └─ routes y_doc:* topics
     config for BlockNote           └─ forwards to DocServer

CollaborativeEditor               YjsPersistence
  └─ BlockNoteView with             └─ stores updates in DB
     collaboration enabled
```

### Key Files

**Backend:**
- `lib/mindrian/collaboration/doc_server.ex` - Yjs document GenServer
- `lib/mindrian/collaboration/yjs_persistence.ex` - DB persistence
- `lib/mindrian_web/channels/y_doc_channel.ex` - Phoenix channel

**Frontend:**
- `src/contexts/collaboration.ts` - Context definition
- `src/contexts/CollaborationContext.tsx` - Provider
- `src/hooks/useCollaboration.ts` - Hook with sync state
- `src/components/CollaborativeEditor.tsx` - BlockNote wrapper

## Known Limitations

### 1. Selection conflicts on deleted elements

**Symptom:** `TypeError: Cannot read properties of null (reading 'nodeSize')` when one client deletes an element another client has selected.

**Cause:** ProseMirror (BlockNote's editor engine) doesn't gracefully handle cursors pointing to deleted nodes in concurrent editing scenarios.

**Direction to fix:**
- Wrap BlockNote operations in error boundary
- Or: Add ProseMirror plugin to detect and reset stale selections
- Or: Wait for upstream BlockNote fix

### 2. Channel authentication is incomplete

**Symptom:** Unauthenticated sockets can join user-specific channels.

**Cause:** `UserSocket.connect/3` reads session token but allows connection even when auth fails. `DocumentsChannel.join/3` has a fallback that allows unauthenticated sockets to join any user's channel:

```elixir
# documents_channel.ex:9-14
if socket_user_id == nil or to_string(socket_user_id) == user_id do
```

**Direction to fix:**
- Remove the `socket_user_id == nil` fallback in DocumentsChannel
- Consider rejecting socket connections entirely when not authenticated (return `{:error, ...}` from `UserSocket.connect/3`)
- Or pass auth token in socket params and verify it

### 2a. YDocChannel has no authorization

**Symptom:** Any authenticated user can join any document's Yjs channel.

**Cause:** `YDocChannel.join/3` doesn't check document ownership. Since `doc_name` matches `document.id`, users can edit each other's documents.

**Direction to fix:**
```elixir
def join("y_doc:" <> doc_name, _payload, socket) do
  user_id = socket.assigns[:user_id]
  if user_id && Documents.can_access?(user_id, doc_name) do
    # existing logic
  else
    {:error, %{reason: "unauthorized"}}
  end
end
```

This requires implementing `Documents.can_access?/2` which checks ownership or collaborator status.

### 3. No cursor/presence display

**Symptom:** Can't see other users' cursors or who's editing.

**Cause:** Awareness data is synced but not rendered.

**Direction to fix:**
- BlockNote supports awareness via `collaboration.user`
- Need to style cursor elements (BlockNote may have built-in styles)
- Consider adding presence list UI component

### 4. No document compaction

**Symptom:** `yjs_documents` table grows indefinitely with every edit.

**Cause:** MVP stores every update without compaction.

**Direction to fix:**
- Implement compaction in `YjsPersistence` (see original plan for reference code)
- After N updates, encode full state and delete old updates
- Run compaction on DocServer shutdown or periodically

### 5. DocumentCollaborator schema unused

**Symptom:** `document_collaborators` table exists but is never queried.

**Cause:** Multi-user collaboration not yet implemented. The schema was created in anticipation of shared document access.

**Current state:** Documents are single-owner only. The `Documents` context only queries by `user_id` ownership.

**Direction to fix:**
- Implement `Documents.can_access?/2` that checks ownership OR collaborator status
- Add API endpoints for inviting collaborators
- Update channel auth to use `can_access?/2` instead of ownership check
- Or: Remove the migration/schema if not implementing soon

### 6. DocServer memory management

**Symptom:** DocServers stay alive indefinitely once created.

**Cause:** No TTL or cleanup logic in current implementation.

**Direction to fix:**
- Track connected clients via Phoenix.Presence
- Add shutdown timer when last client disconnects
- Persist and unload idle documents

## References

- [BlockNote collaboration docs](https://www.blocknotejs.org/docs/collaboration)
- [y_ex on Hex.pm](https://hex.pm/packages/y_ex)
- [Yjs documentation](https://docs.yjs.dev/)
- `docs/research/` - Local research findings on y_ex and BlockNote
