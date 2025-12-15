# Phoenix Channel + Binary Data Research Spike

**Goal:** Verify binary messages work over Phoenix Channels for Yjs sync.

## Tasks

- [ ] Send binary (Uint8Array) from browser to Phoenix Channel
- [ ] Receive and decode in Elixir
- [ ] Send binary from Phoenix to browser
- [ ] Receive and decode in JavaScript
- [ ] Document the encoding/decoding pattern

## Findings

### Browser to Phoenix (Uint8Array)

_TODO: How to send binary data from JS phoenix client_

```javascript
// Example pattern
channel.push("sync", { data: /* ??? */ });
```

### Decoding in Elixir

_TODO: How Elixir receives and decodes binary_

```elixir
# Example pattern
def handle_in("sync", %{"data" => data}, socket) do
  # How is data represented?
end
```

### Phoenix to Browser (Binary)

_TODO: How to send binary from Elixir_

```elixir
# Example pattern
push(socket, "update", %{data: /* ??? */})
```

### Decoding in JavaScript

_TODO: How to receive and decode as Uint8Array_

```javascript
// Example pattern
channel.on("update", (payload) => {
  const data = /* ??? */;
});
```

### Encoding Pattern Summary

| Direction | Sender Encodes | Wire Format | Receiver Decodes |
|-----------|----------------|-------------|------------------|
| JS → Elixir | _TODO_ | _TODO_ | _TODO_ |
| Elixir → JS | _TODO_ | _TODO_ | _TODO_ |

## Performance Notes

_TODO: Any overhead from encoding? Message size limits?_

## Integration Notes

_TODO: Recommendations for Yjs update messages_

## References

- [Phoenix Channels documentation](https://hexdocs.pm/phoenix/channels.html)
- [phoenix npm package](https://www.npmjs.com/package/phoenix)
- [Yjs encoding](https://docs.yjs.dev/api/document-updates)
