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

  # Agent origin is an atom, not a PID - use regular broadcast
  defp broadcast_update(origin, topic, message) when is_atom(origin) do
    MindrianWeb.Endpoint.broadcast(topic, "yjs", {:binary, message})
  end

  defp broadcast_update(origin, topic, message) when is_pid(origin) do
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

    Logger.debug("append_block: type=#{block_type}, content=#{content}")

    # BlockNote structure: fragment > blockGroup > blockContainer > paragraph/heading/etc > text
    # We need to find the root blockGroup and append a blockContainer inside it
    case get_root_block_group(fragment) do
      {:ok, block_group} ->
        block_id = generate_block_id()
        block_container = create_block_container(block_type, block_id, content)
        Yex.XmlElement.push(block_group, block_container)

      :error ->
        # No blockGroup exists - create the full structure
        Logger.debug("No blockGroup found, creating full structure")
        block_id = generate_block_id()
        prelim = create_full_block_structure(block_type, block_id, content)
        Yex.XmlFragment.push(fragment, prelim)
    end
  end

  defp apply_operation(fragment, %{"type" => "insert_block"} = op) do
    block = op["block"] || %{}
    block_type = block["type"] || "paragraph"
    content = block["content"] || ""
    after_id = op["after_id"]

    case get_root_block_group(fragment) do
      {:ok, block_group} ->
        block_id = generate_block_id()
        block_container = create_block_container(block_type, block_id, content)

        if after_id do
          # Find the index of the blockContainer with the given ID inside blockGroup
          case find_block_container_index(block_group, after_id) do
            {:ok, index} ->
              Yex.XmlElement.insert(block_group, index + 1, block_container)

            :error ->
              # If not found, insert at end
              Yex.XmlElement.push(block_group, block_container)
          end
        else
          # Insert at beginning
          Yex.XmlElement.insert(block_group, 0, block_container)
        end

      :error ->
        # No blockGroup - create full structure
        block_id = generate_block_id()
        prelim = create_full_block_structure(block_type, block_id, content)
        Yex.XmlFragment.push(fragment, prelim)
    end
  end

  defp apply_operation(fragment, %{"type" => "delete_block", "block_id" => block_id}) do
    case get_root_block_group(fragment) do
      {:ok, block_group} ->
        case find_block_container_index(block_group, block_id) do
          {:ok, index} ->
            Yex.XmlElement.delete(block_group, index, 1)

          :error ->
            {:error, "Block not found: #{block_id}"}
        end

      :error ->
        {:error, "No blockGroup found in document"}
    end
  end

  defp apply_operation(fragment, %{"type" => "update_block", "block_id" => block_id} = op) do
    content = op["content"] || ""

    case get_root_block_group(fragment) do
      {:ok, block_group} ->
        case find_block_container_index(block_group, block_id) do
          {:ok, index} ->
            # Get the existing blockContainer to find the inner block type
            {:ok, existing_container} = Yex.XmlElement.fetch(block_group, index)
            block_type = get_inner_block_type(existing_container)

            # Delete and re-insert with new content
            Yex.XmlElement.delete(block_group, index, 1)
            block_container = create_block_container(block_type, block_id, content)
            Yex.XmlElement.insert(block_group, index, block_container)

          :error ->
            {:error, "Block not found: #{block_id}"}
        end

      :error ->
        {:error, "No blockGroup found in document"}
    end
  end

  defp apply_operation(_fragment, op) do
    {:error, "Unknown operation type: #{inspect(op)}"}
  end

  # Find the root blockGroup element in the fragment
  defp get_root_block_group(fragment) do
    fragment
    |> Yex.XmlFragment.children()
    |> Enum.find(fn elem ->
      case elem do
        %Yex.XmlElement{} -> Yex.XmlElement.get_tag(elem) == "blockGroup"
        _ -> false
      end
    end)
    |> case do
      nil -> :error
      block_group -> {:ok, block_group}
    end
  end

  # Create a blockContainer with nested block type and content
  # Structure: <blockContainer id="..."><paragraph ...>TEXT</paragraph></blockContainer>
  defp create_block_container(block_type, block_id, content) do
    # Normalize block_type - agent might send "blockGroup" but we need actual types
    actual_type = if block_type in ["blockGroup", "blockContainer"], do: "paragraph", else: block_type

    # Parse markdown bold and convert to delta format
    text_prelim = parse_markdown_to_prelim(content)

    # Create the inner block (paragraph, heading, etc) with default props
    inner_block =
      Yex.XmlElementPrelim.new(
        actual_type,
        [text_prelim],
        %{
          "backgroundColor" => "default",
          "textAlignment" => "left",
          "textColor" => "default"
        }
      )

    # Wrap in blockContainer
    Yex.XmlElementPrelim.new(
      "blockContainer",
      [inner_block],
      %{"id" => block_id}
    )
  end

  # Parse markdown bold (**text**) and convert to Yjs delta format
  defp parse_markdown_to_prelim(content) when is_binary(content) do
    # Regex to match **bold** patterns
    # Split content into segments, preserving bold markers
    parts = Regex.split(~r/(\*\*[^*]+\*\*)/, content, include_captures: true)

    delta =
      parts
      |> Enum.reject(&(&1 == ""))
      |> Enum.map(fn part ->
        if String.starts_with?(part, "**") and String.ends_with?(part, "**") do
          # Bold text - strip markers and add attribute
          text = String.slice(part, 2..-3//1)
          %{insert: text, attributes: %{"bold" => true}}
        else
          # Plain text
          %{insert: part}
        end
      end)

    case delta do
      [] -> Yex.XmlTextPrelim.from("")
      _ -> Yex.XmlTextPrelim.from(delta)
    end
  end

  defp parse_markdown_to_prelim(content), do: Yex.XmlTextPrelim.from(to_string(content))

  # Create a full block structure for empty documents
  # Structure: <blockGroup><blockContainer id="..."><paragraph ...>TEXT</paragraph></blockContainer></blockGroup>
  defp create_full_block_structure(block_type, block_id, content) do
    block_container = create_block_container(block_type, block_id, content)

    Yex.XmlElementPrelim.new(
      "blockGroup",
      [block_container],
      %{}
    )
  end

  # Find blockContainer by id within a blockGroup element
  defp find_block_container_index(block_group, block_id) do
    block_group
    |> Yex.XmlElement.children()
    |> Enum.with_index()
    |> Enum.find_value(:error, fn {elem, index} ->
      case elem do
        %Yex.XmlElement{} ->
          attrs = Yex.XmlElement.get_attributes(elem)

          if attrs["id"] == block_id do
            {:ok, index}
          else
            nil
          end

        _ ->
          nil
      end
    end)
  end

  # Get the inner block type from a blockContainer (e.g., "paragraph", "heading")
  defp get_inner_block_type(block_container) do
    block_container
    |> Yex.XmlElement.children()
    |> Enum.find_value("paragraph", fn elem ->
      case elem do
        %Yex.XmlElement{} -> Yex.XmlElement.get_tag(elem)
        _ -> nil
      end
    end)
  end

  defp generate_block_id do
    :crypto.strong_rand_bytes(8) |> Base.url_encode64(padding: false)
  end

  defp extract_blocks(fragment) do
    children = Yex.XmlFragment.children(fragment) |> Enum.to_list()
    Logger.debug("extract_blocks: #{length(children)} children in fragment")

    # Log full structure for debugging
    Enum.each(children, fn child ->
      log_element_tree(child, 0)
    end)

    # BlockNote structure: fragment > blockGroup > blockContainer > paragraph/etc
    # Extract blocks from inside the blockGroup
    case get_root_block_group(fragment) do
      {:ok, block_group} ->
        block_group
        |> Yex.XmlElement.children()
        |> Enum.filter(fn elem ->
          case elem do
            %Yex.XmlElement{} -> Yex.XmlElement.get_tag(elem) == "blockContainer"
            _ -> false
          end
        end)
        |> Enum.map(&extract_block_from_container/1)

      :error ->
        # Fallback to old behavior for non-BlockNote documents
        children
        |> Enum.map(&extract_block/1)
    end
  end

  # Extract block info from a blockContainer element
  defp extract_block_from_container(%Yex.XmlElement{} = container) do
    attrs = Yex.XmlElement.get_attributes(container)
    block_id = attrs["id"]

    # Find the inner block (paragraph, heading, etc)
    inner_block =
      container
      |> Yex.XmlElement.children()
      |> Enum.find(fn elem ->
        case elem do
          %Yex.XmlElement{} -> true
          _ -> false
        end
      end)

    case inner_block do
      %Yex.XmlElement{} = block ->
        tag = Yex.XmlElement.get_tag(block)
        block_attrs = Yex.XmlElement.get_attributes(block)
        content = extract_text_content(block)

        %{
          id: block_id,
          type: tag,
          props: block_attrs,
          content: content
        }

      _ ->
        %{
          id: block_id,
          type: "unknown",
          props: %{},
          content: ""
        }
    end
  end

  # Debug helper to log the full XML tree structure
  defp log_element_tree(%Yex.XmlElement{} = elem, depth) do
    indent = String.duplicate("  ", depth)
    tag = Yex.XmlElement.get_tag(elem)
    attrs = Yex.XmlElement.get_attributes(elem)
    Logger.debug("#{indent}<#{tag} #{inspect(attrs)}>")

    elem
    |> Yex.XmlElement.children()
    |> Enum.each(fn child ->
      log_element_tree(child, depth + 1)
    end)

    Logger.debug("#{indent}</#{tag}>")
  end

  defp log_element_tree(%Yex.XmlText{} = text, depth) do
    indent = String.duplicate("  ", depth)
    content = Yex.XmlText.to_string(text)
    Logger.debug("#{indent}TEXT: #{inspect(content)}")
  end

  defp log_element_tree(other, depth) do
    indent = String.duplicate("  ", depth)
    Logger.debug("#{indent}UNKNOWN: #{inspect(other)}")
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
