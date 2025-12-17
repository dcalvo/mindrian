# BlockNote + Yjs Research Spike

**Goal:** Verify BlockNote's Yjs integration works for collaborative editing.

**Status:** ✅ Complete - Reference implementation found in y-phoenix-channel

## Setup

```bash
npm install @blocknote/core @blocknote/react @blocknote/mantine
npm install yjs y-phoenix-channel phoenix
```

## Findings

### BlockNote Yjs Integration

BlockNote has built-in Yjs support via the `collaboration` option in `useCreateBlockNote`:

```tsx
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import * as Y from "yjs";

const ydoc = new Y.Doc();

function Editor() {
  const editor = useCreateBlockNote({
    collaboration: {
      provider,  // Any Yjs provider (y-websocket, y-phoenix-channel, etc.)
      fragment: ydoc.getXmlFragment("document-store"),  // Must be XmlFragment
      user: {
        name: "Alice",
        color: "#ff0000",
      },
    },
  });

  return <BlockNoteView editor={editor} />;
}
```

**Key points:**
- BlockNote uses `Y.XmlFragment` (not Y.Text or Y.Array) for the document structure
- The fragment name "document-store" is conventional but can be anything
- User info is used for cursor/presence display

### Provider Setup (Phoenix Channel)

Using y-phoenix-channel for Phoenix backend integration:

```tsx
import { Socket } from "phoenix";
import { PhoenixChannelProvider } from "y-phoenix-channel";
import * as Y from "yjs";

const socket = new Socket("/socket");
socket.connect();

const ydoc = new Y.Doc();
const docId = "my-document-id";

const provider = new PhoenixChannelProvider(
  socket,
  `y_doc_room:${docId}`,  // Channel topic
  ydoc,
  {
    connect: true,        // Auto-connect
    awareness: undefined, // Uses default awareness
    params: {},           // Channel join params (for auth)
    resyncInterval: -1,   // Disable periodic resync
    disableBc: false,     // Enable cross-tab sync via BroadcastChannel
  }
);
```

### Collaboration Test Results

From y-phoenix-channel demo (https://y-phoenix.gigalixirapp.com/blocknote):
- ✅ Real-time sync between tabs/users works
- ✅ Cursor positions visible
- ✅ User names/colors displayed
- ✅ Works with BlockNote, Quill, TipTap, ProseMirror, Lexical, Excalidraw

### Issues & Limitations

1. **XmlFragment requirement**: BlockNote specifically requires `Y.XmlFragment`, not other Yjs types
2. **Awareness cleanup**: Need to handle user disconnect to clean up stale cursors
3. **Initial load**: May need to handle "synced" event before showing editor to avoid flicker

### Cursor/Selection Awareness

Yes, BlockNote supports awareness:
- Cursors are shown with user's color
- Selection ranges are highlighted
- User names appear next to cursors
- Handled automatically when `collaboration.user` is provided

The awareness state includes:
```javascript
{
  user: { name: string, color: string },
  cursor: { anchor: RelativePosition, head: RelativePosition } | null
}
```

## Integration Notes

### Phoenix Backend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend                              │
├─────────────────────────────────────────────────────────────┤
│  BlockNoteView                                               │
│       ↓                                                      │
│  useCreateBlockNote({ collaboration: { provider, ... } })    │
│       ↓                                                      │
│  Y.Doc ←→ PhoenixChannelProvider                            │
│                    ↓                                         │
│              Phoenix Socket (binary)                         │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    Phoenix Backend                           │
├─────────────────────────────────────────────────────────────┤
│  UserSocket                                                  │
│       ↓                                                      │
│  YDocRoomChannel (y_doc_room:*)                             │
│       ↓                                                      │
│  DocServer (GenServer using Yex.DocServer)                  │
│       ↓                                                      │
│  Yex.Doc + Yex.Awareness                                    │
│       ↓                                                      │
│  EctoPersistence (PostgreSQL)                               │
└─────────────────────────────────────────────────────────────┘
```

### Key Backend Components Needed

1. **DocServer** - GenServer managing Yex.Doc per document
2. **YDocChannel** - Phoenix channel for sync protocol
3. **Persistence** - Store updates in PostgreSQL
4. **Presence** - Track connected users (Phoenix.Presence)

## References

- [BlockNote documentation](https://www.blocknotejs.org/)
- [BlockNote Yjs example](https://www.blocknotejs.org/docs/collaboration)
- [Yjs documentation](https://docs.yjs.dev/)
- [y-websocket](https://github.com/yjs/y-websocket)

### CRDT Research

- [Algorithms by Evan Wallace](https://madebyevan.com/algos/) - Interactive visualizations including CRDTs
- [CRDT Text Buffer](https://madebyevan.com/algos/crdt-text-buffer/) - Interactive explanation of CRDT text editing
- [Peritext (Ink & Switch)](https://www.inkandswitch.com/peritext/) - Rich text CRDT preserving formatting intent
