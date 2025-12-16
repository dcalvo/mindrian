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

### 2. No channel authentication

**Symptom:** Any client can join any document channel without authentication.

**Cause:** MVP simplification - `UserSocket.connect/3` doesn't verify session.

**Direction to fix:**
- Pass session token in socket params
- Verify token in `connect/3`, assign user to socket
- Check document permissions in `YDocChannel.join/3`

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

### 5. No document management

**Symptom:** Only hardcoded "test-doc" exists.

**Cause:** MVP simplification.

**Direction to fix:**
- Add `documents` table with metadata (title, owner, created_at)
- Add document CRUD API endpoints
- Add document creation/selection UI in FileTree component
- Update routing to support `/document/:id`

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
