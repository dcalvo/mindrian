# BlockNote + Yjs Research Spike

**Goal:** Verify BlockNote's Yjs integration works for collaborative editing.

## Tasks

- [ ] Create minimal React app with BlockNote
- [ ] Add Yjs provider (y-websocket with demo server, or local-only)
- [ ] Open in two browser tabs
- [ ] Type in one, verify appears in other
- [ ] Note any issues, limitations
- [ ] Document findings

## Setup

```bash
pnpm add @blocknote/core @blocknote/react @blocknote/mantine
pnpm add yjs y-websocket
```

## Findings

### BlockNote Yjs Integration

_TODO: How BlockNote integrates with Yjs_

### Provider Setup

_TODO: Document y-websocket or custom provider setup_

### Collaboration Test Results

_TODO: Results from two-tab sync test_

### Issues & Limitations

_TODO: Any problems encountered_

### Cursor/Selection Awareness

_TODO: Does BlockNote support awareness (showing other users' cursors)?_

## Integration Notes

_TODO: Recommendations for integrating with Phoenix backend_

## References

- [BlockNote documentation](https://www.blocknotejs.org/)
- [BlockNote Yjs example](https://www.blocknotejs.org/docs/collaboration)
- [Yjs documentation](https://docs.yjs.dev/)
- [y-websocket](https://github.com/yjs/y-websocket)
