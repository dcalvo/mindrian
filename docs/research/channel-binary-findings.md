# Phoenix Channel + Binary Data Research Spike

**Goal:** Verify binary messages work over Phoenix Channels for Yjs sync.

**Status:** ✅ Complete - Working implementation via y-phoenix-channel

## Tasks

- [x] Send binary (Uint8Array) from browser to Phoenix Channel
- [x] Receive and decode in Elixir
- [x] Send binary from Phoenix to browser
- [x] Receive and decode in JavaScript
- [x] Document the encoding/decoding pattern

## Findings

### Browser to Phoenix (Uint8Array)

The `y-phoenix-channel` library handles this automatically. It sends binary Yjs messages using the Phoenix channel's binary encoding:

```javascript
// y-phoenix-channel internally does:
channel.push("yjs", { binary: true, data: arrayBuffer });
```

The Phoenix JS client automatically encodes ArrayBuffer/Uint8Array as binary frames.

### Decoding in Elixir

Phoenix Channels receive binary data as `{:binary, data}` tuple in the event payload:

```elixir
# Pattern match on {:binary, data} to receive raw binary
def handle_in("yjs", {:binary, data}, socket) do
  # data is a binary (<<...>>)
  # Forward to DocServer for Yjs processing
  DocServer.process_message_v1(socket.assigns.doc_pid, data, self())
  {:noreply, socket}
end

# Also handle alternative event name from y-phoenix-channel
def handle_in("yjs_sync", {:binary, data}, socket) do
  handle_yjs_message(data, socket)
end
```

### Phoenix to Browser (Binary)

Use `{:binary, data}` tuple when pushing:

```elixir
# Push binary data to client
push(socket, "yjs", {:binary, message})

# Or broadcast to all clients on topic
MindrianWeb.Endpoint.broadcast(topic, "yjs", {:binary, message})

# Broadcast to all except origin
MindrianWeb.Endpoint.broadcast_from(origin_pid, topic, "yjs", {:binary, message})
```

### Decoding in JavaScript

The `y-phoenix-channel` library handles decoding automatically. The Phoenix JS client delivers binary frames as ArrayBuffer:

```javascript
// y-phoenix-channel internally does:
channel.on("yjs", (payload) => {
  // payload is ArrayBuffer when binary
  const update = new Uint8Array(payload);
  Y.applyUpdate(ydoc, update);
});
```

### Encoding Pattern Summary

| Direction | Sender Encodes | Wire Format | Receiver Decodes |
|-----------|----------------|-------------|------------------|
| JS → Elixir | ArrayBuffer via Phoenix client | WebSocket binary frame | `{:binary, data}` tuple |
| Elixir → JS | `{:binary, data}` tuple | WebSocket binary frame | ArrayBuffer |

## Performance Notes

- Binary frames have minimal overhead vs JSON (no base64 encoding)
- Phoenix WebSocket has default max frame size of 10MB (configurable)
- Yjs updates are typically small (incremental), compacted state can be larger

## Integration Notes

For Yjs over Phoenix Channels:

1. Use `y-phoenix-channel` on frontend - handles all encoding/protocol details
2. Use `Yex.DocServer` behavior on backend - provides `process_message_v1/3` for handling sync protocol
3. Event names: `"yjs"` or `"yjs_sync"` (y-phoenix-channel uses both)
4. Always use `{:binary, data}` tuples, not maps with binary values

## References

- [Phoenix Channels documentation](https://hexdocs.pm/phoenix/channels.html)
- [phoenix npm package](https://www.npmjs.com/package/phoenix)
- [y-phoenix-channel](https://github.com/satoren/y-phoenix-channel)
- [Yjs encoding](https://docs.yjs.dev/api/document-updates)
