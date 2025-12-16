# y_ex Research Spike

**Goal:** Understand y_ex API for server-side Yjs document handling.

**Status:** ✅ Complete - Explored via y-phoenix-channel reference implementation

## Setup

```elixir
# mix.exs
{:y_ex, "~> 0.10.2"}
```

## Findings

### Basic API

```elixir
# Create a document
doc = Yex.Doc.new()

# Get shared types (creates if not exists)
text = Yex.Doc.get_text(doc, "content")
array = Yex.Doc.get_array(doc, "blocks")
map = Yex.Doc.get_map(doc, "metadata")
xml_fragment = Yex.Doc.get_xml_fragment(doc, "document-store")  # Used by BlockNote

# Wrap mutations in transactions
Yex.Doc.transaction(doc, origin, fn ->
  Yex.Text.insert(text, 0, "Hello")
end)

# Monitor updates (for broadcasting to clients)
{:ok, _ref} = Yex.Doc.monitor_update(doc)
# Receive: {:update_v1, update_binary, origin, metadata}
```

### Applying Client Updates

```elixir
# Decode incoming message from client
{:ok, message} = Yex.Sync.message_decode(binary_from_client)

# Message types:
# {:sync, {:sync_step1, state_vector}} - Client requesting sync
# {:sync, {:sync_step2, update}} - Client sending full state
# {:sync, {:sync_update, update}} - Incremental update
# {:awareness, binary} - Presence/cursor data

# Apply update within transaction
Yex.Doc.transaction(doc, origin, fn ->
  Yex.apply_update(doc, update_binary)
end)
```

### Encoding State for Client

```elixir
# Get state vector (for diffing)
{:ok, state_vector} = Yex.encode_state_vector(doc)

# Get full state as update
{:ok, update} = Yex.encode_state_as_update(doc)

# Get diff from client's state vector
{:ok, diff} = Yex.encode_state_as_update(doc, client_state_vector)

# Encode message for wire
{:ok, binary} = Yex.Sync.message_encode({:sync, {:sync_step2, update}})
```

### DocServer Behavior

y_ex provides `Yex.DocServer` - a GenServer behavior for managing collaborative documents:

```elixir
defmodule MyDocServer do
  use Yex.DocServer

  @impl true
  def init(_arg, state) do
    {:ok, state}
  end

  @impl true
  def handle_update_v1(doc, update, origin, state) do
    # Broadcast to other clients, persist, etc.
    {:noreply, state}
  end

  @impl true
  def handle_awareness_update(awareness, %{added: _, updated: _, removed: _}, origin, state) do
    # Handle cursor/presence changes
    {:noreply, state}
  end
end

# Start and use
{:ok, pid} = MyDocServer.start_link([], name: {:global, {:doc, doc_id}})
MyDocServer.process_message_v1(pid, binary_message, origin_pid)
```

### Awareness (Cursors/Presence)

```elixir
{:ok, awareness} = Yex.Awareness.new(doc)

# Set local state
Yex.Awareness.set_local_state(awareness, %{"user" => "Alice", "cursor" => %{...}})

# Get all states
states = Yex.Awareness.get_states(awareness)  # %{client_id => state}

# Encode/apply updates
{:ok, update} = Yex.Awareness.encode_update(awareness, [client_id])
Yex.Awareness.apply_update(awareness, update_binary, origin)

# Monitor changes
Yex.Awareness.monitor_update(awareness)
# Receive: {:awareness_update, %{added: [], updated: [], removed: []}, origin, metadata}
```

### Integration Notes

1. **Cross-process operations**: Doc operations from different processes are delegated via GenServer.call to the creator process. Use `Yex.DocServer` for multi-process scenarios.

2. **Feature parity**: y_ex supports YText, YArray, YMap, YXmlFragment (what BlockNote uses), awareness, and undo manager. Missing: snapshots.

3. **Binary protocol**: Uses same y-protocols as JavaScript Yjs - v1 encoding is default.

4. **NIF-based**: Built on y-crdt Rust library via Rustler. High performance but requires Rust toolchain for compilation.

## References

- [y_ex on Hex.pm](https://hex.pm/packages/y_ex)
- [y_ex GitHub](https://github.com/satoren/y_ex)
- [Yjs documentation](https://docs.yjs.dev/)
