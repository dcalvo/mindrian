defmodule Mindrian.Collaboration.DocServer do
  @moduledoc """
  GenServer that manages a collaborative Yjs document.

  Uses Yex.DocServer behavior to handle Yjs sync protocol messages
  and broadcasts updates to connected clients via Phoenix PubSub.

  ## Yex Transaction Pitfall

  **Never call `Yex.Doc.get_xml_fragment/2`, `get_text/2`, `get_array/2`, or `get_map/2`
  inside a `Yex.Doc.transaction/3` block.** This causes a silent deadlock because
  these functions try to acquire a lock that the transaction already holds.

  Wrong:

      Yex.Doc.transaction(doc, fn ->
        fragment = Yex.Doc.get_xml_fragment(doc, "name")  # DEADLOCK!
        Yex.XmlFragment.push(fragment, content)
      end)

  Correct:

      fragment = Yex.Doc.get_xml_fragment(doc, "name")  # Outside transaction
      Yex.Doc.transaction(doc, fn ->
        Yex.XmlFragment.push(fragment, content)
      end)

  The returned shared type structs are live references (not snapshots), so fetching
  them once and reusing them is both safe and efficient. We cache the fragment in
  state during `init/2` for this reason.
  """
  use Yex.DocServer
  require Logger
  alias Yex.{Awareness, Sync}
  alias Mindrian.Collaboration.YjsPersistence

  @impl true
  def init(option, %{doc: doc} = state) do
    topic = Keyword.fetch!(option, :topic)
    doc_name = Keyword.fetch!(option, :doc_name)

    Logger.info("DocServer for #{doc_name} initialized")

    persistence_state = YjsPersistence.bind(%{}, doc_name, doc)

    # Pre-fetch the fragment outside of any transaction to avoid deadlocks.
    # This is a live reference, not a snapshot - it always reflects current state.
    fragment = Yex.Doc.get_xml_fragment(doc, "document-store")

    {:ok,
     state
     |> assign(%{
       topic: topic,
       doc_name: doc_name,
       persistence_state: persistence_state,
       fragment: fragment,
       # Map of origin PID -> client_id for tracking connected clients
       client_ids: %{}
     })}
  end

  @impl true
  def handle_update_v1(doc, update, origin, state) do
    # Persist the update
    YjsPersistence.update_v1(
      state.assigns.persistence_state,
      update,
      state.assigns.doc_name,
      doc
    )

    # Broadcast to other clients
    with {:ok, sync_msg} <- Sync.get_update(update),
         {:ok, message} <- Sync.message_encode({:sync, sync_msg}) do
      broadcast_update(origin, state.assigns.topic, message)
    else
      error ->
        Logger.warning("Failed to broadcast update: #{inspect(error)}")
    end

    {:noreply, state}
  end

  @impl true
  def handle_awareness_update(
        awareness,
        %{removed: removed, added: added, updated: updated},
        origin,
        state
      ) do
    updated_clients = added ++ updated ++ removed

    # Track client IDs by origin PID for cleanup on disconnect
    state =
      if is_pid(origin) and added != [] do
        # Associate the first added client_id with this origin PID
        client_id = List.first(added)
        assign(state, :client_ids, Map.put(state.assigns.client_ids, origin, client_id))
      else
        state
      end

    with {:ok, update} <- Awareness.encode_update(awareness, updated_clients),
         {:ok, message} <- Sync.message_encode({:awareness, update}) do
      broadcast_update(origin, state.assigns.topic, message)
    else
      error ->
        Logger.warning("Failed to broadcast awareness update: #{inspect(error)}")
    end

    {:noreply, state}
  end

  @impl true
  def handle_call({:client_disconnected, origin_pid}, _from, state) do
    case Map.get(state.assigns.client_ids, origin_pid) do
      nil ->
        {:reply, :ok, state}

      client_id ->
        Logger.debug("Removing awareness for client #{client_id}")

        # Remove the client's awareness state
        Awareness.remove_states(state.awareness, [client_id])

        # Broadcast the removal to other clients
        with {:ok, update} <- Awareness.encode_update(state.awareness, [client_id]),
             {:ok, message} <- Sync.message_encode({:awareness, update}) do
          broadcast_update(nil, state.assigns.topic, message)
        end

        # Remove from our tracking map
        new_client_ids = Map.delete(state.assigns.client_ids, origin_pid)
        {:reply, :ok, assign(state, :client_ids, new_client_ids)}
    end
  end

  @impl true
  def handle_call({:apply_block_operations, operations}, _from, state) do
    result =
      Yex.Doc.transaction(state.doc, :agent, fn ->
        apply_operations(state.assigns.fragment, operations)
      end)

    {:reply, result, state}
  end

  @impl true
  def handle_call(:get_blocks, _from, state) do
    blocks =
      Yex.Doc.transaction(state.doc, fn ->
        extract_blocks(state.assigns.fragment)
      end)

    {:reply, {:ok, blocks}, state}
  end

  @doc """
  Notify the DocServer that a client has disconnected.
  """
  def client_disconnected(server, origin_pid) do
    GenServer.call(server, {:client_disconnected, origin_pid})
  end

  @doc """
  Apply block operations to a document.
  Looks up or starts the DocServer for the document and applies the operations.
  """
  def apply_block_operations(doc_id, operations) do
    topic = "y_doc:#{doc_id}"

    case start_or_get_doc_server(doc_id, topic) do
      {:ok, pid} ->
        GenServer.call(pid, {:apply_block_operations, operations})

      {:error, reason} ->
        {:error, reason}
    end
  end

  @doc """
  Get blocks from a document.
  """
  def get_blocks(doc_id) do
    topic = "y_doc:#{doc_id}"

    case start_or_get_doc_server(doc_id, topic) do
      {:ok, pid} ->
        GenServer.call(pid, :get_blocks)

      {:error, reason} ->
        {:error, reason}
    end
  end

  defp start_or_get_doc_server(doc_name, topic) do
    case Registry.lookup(Mindrian.DocServerRegistry, doc_name) do
      [{pid, _}] ->
        {:ok, pid}

      [] ->
        __MODULE__.start([topic: topic, doc_name: doc_name],
          name: {:via, Registry, {Mindrian.DocServerRegistry, doc_name}}
        )
    end
    |> case do
      {:ok, pid} ->
        {:ok, pid}

      {:error, {:already_started, pid}} ->
        {:ok, pid}

      {:error, reason} ->
        Logger.error("Failed to start DocServer for #{doc_name}: #{inspect(reason)}")
        {:error, "failed to start doc server"}
    end
  end

  @impl true
  def terminate(_reason, state) do
    YjsPersistence.unbind(
      state.assigns.persistence_state,
      state.assigns.doc_name,
      state.doc
    )

    Logger.info("DocServer for #{state.assigns.doc_name} terminated")
    :ok
  end

  defp broadcast_update(nil, topic, message) do
    MindrianWeb.Endpoint.broadcast(topic, "yjs", {:binary, message})
  end

  defp broadcast_update(origin, topic, message) do
    MindrianWeb.Endpoint.broadcast_from(origin, topic, "yjs", {:binary, message})
  end

  # Block operations helpers

  defp apply_operations(fragment, operations) do
    Enum.reduce_while(operations, :ok, fn op, _acc ->
      case apply_operation(fragment, op) do
        :ok -> {:cont, :ok}
        {:error, _} = err -> {:halt, err}
      end
    end)
  end

  defp apply_operation(fragment, %{"type" => "append_block"} = op) do
    block = op["block"] || %{}
    block_type = block["type"] || "paragraph"
    content = block["content"] || ""

    # Generate a unique block ID
    block_id = generate_block_id()

    # Create an XmlElement for the block with BlockNote structure
    prelim = create_block_prelim(block_type, block_id, content)
    Yex.XmlFragment.push(fragment, prelim)
  end

  defp apply_operation(fragment, %{"type" => "insert_block"} = op) do
    block = op["block"] || %{}
    block_type = block["type"] || "paragraph"
    content = block["content"] || ""
    after_id = op["after_id"]

    block_id = generate_block_id()
    prelim = create_block_prelim(block_type, block_id, content)

    if after_id do
      # Find the index of the block with the given ID
      case find_block_index(fragment, after_id) do
        {:ok, index} ->
          Yex.XmlFragment.insert(fragment, index + 1, prelim)

        :error ->
          # If not found, insert at end
          Yex.XmlFragment.push(fragment, prelim)
      end
    else
      # Insert at beginning
      Yex.XmlFragment.insert(fragment, 0, prelim)
    end
  end

  defp apply_operation(fragment, %{"type" => "delete_block", "block_id" => block_id}) do
    case find_block_index(fragment, block_id) do
      {:ok, index} ->
        Yex.XmlFragment.delete(fragment, index, 1)

      :error ->
        {:error, "Block not found: #{block_id}"}
    end
  end

  defp apply_operation(fragment, %{"type" => "update_block", "block_id" => block_id} = op) do
    content = op["content"] || ""

    case find_block_index(fragment, block_id) do
      {:ok, index} ->
        # Get the existing block to preserve its type
        {:ok, existing} = Yex.XmlFragment.fetch(fragment, index)
        block_type = Yex.XmlElement.get_tag(existing)

        # Delete and re-insert with new content
        Yex.XmlFragment.delete(fragment, index, 1)
        prelim = create_block_prelim(block_type, block_id, content)
        Yex.XmlFragment.insert(fragment, index, prelim)

      :error ->
        {:error, "Block not found: #{block_id}"}
    end
  end

  defp apply_operation(_fragment, op) do
    {:error, "Unknown operation type: #{inspect(op)}"}
  end

  defp create_block_prelim(block_type, block_id, content) do
    # BlockNote stores blocks as XmlElements with specific structure
    # The tag is the block type, and content is nested in XmlText
    Yex.XmlElementPrelim.new(
      block_type,
      [Yex.XmlTextPrelim.from(content)],
      %{"blockId" => block_id}
    )
  end

  defp find_block_index(fragment, block_id) do
    fragment
    |> Yex.XmlFragment.children()
    |> Enum.with_index()
    |> Enum.find_value(:error, fn {elem, index} ->
      attrs = Yex.XmlElement.get_attributes(elem)

      if attrs["blockId"] == block_id or attrs["id"] == block_id do
        {:ok, index}
      else
        nil
      end
    end)
  end

  defp generate_block_id do
    :crypto.strong_rand_bytes(8) |> Base.url_encode64(padding: false)
  end

  defp extract_blocks(fragment) do
    fragment
    |> Yex.XmlFragment.children()
    |> Enum.map(&extract_block/1)
    |> Enum.to_list()
  end

  defp extract_block(%Yex.XmlElement{} = elem) do
    tag = Yex.XmlElement.get_tag(elem)
    attrs = Yex.XmlElement.get_attributes(elem)
    content = extract_text_content(elem)

    %{
      id: attrs["blockId"] || attrs["id"],
      type: tag,
      props: Map.drop(attrs, ["id", "blockId"]),
      content: content
    }
  end

  defp extract_block(%Yex.XmlText{} = text) do
    %{
      type: "text",
      content: Yex.XmlText.to_string(text)
    }
  end

  defp extract_text_content(elem) do
    elem
    |> Yex.XmlElement.children()
    |> Enum.map(fn
      %Yex.XmlText{} = text -> Yex.XmlText.to_string(text)
      %Yex.XmlElement{} = child -> extract_text_content(child)
    end)
    |> Enum.join("")
  end
end
