defmodule Mindrian.Collaboration.DocServer do
  @moduledoc """
  GenServer that manages a collaborative Yjs document.

  Uses Yex.DocServer behavior to handle Yjs sync protocol messages
  and broadcasts updates to connected clients via Phoenix PubSub.
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

    {:ok,
     state
     |> assign(%{
       topic: topic,
       doc_name: doc_name,
       persistence_state: persistence_state
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
end
