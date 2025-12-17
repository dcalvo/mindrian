defmodule MindrianWeb.DocumentsChannel do
  use MindrianWeb, :channel
  require Logger

  @impl true
  def join("documents:" <> user_id, _payload, socket) do
    socket_user_id = socket.assigns[:user_id]

    # Allow join if socket has matching user_id OR if socket is unauthenticated
    # TODO: Proper channel authentication requires fixing session reading in UserSocket
    if socket_user_id == nil or to_string(socket_user_id) == user_id do
      {:ok, assign(socket, :user_id, user_id)}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  # Broadcast helpers called from Documents context
  def broadcast_created(user_id, document) do
    broadcast_event(user_id, "document_created", %{document: serialize_document(document)})
  end

  def broadcast_updated(user_id, document) do
    broadcast_event(user_id, "document_updated", %{document: serialize_document(document)})
  end

  def broadcast_deleted(user_id, document_id) do
    broadcast_event(user_id, "document_deleted", %{id: document_id})
  end

  defp broadcast_event(user_id, event, payload) do
    topic = "documents:#{user_id}"

    case MindrianWeb.Endpoint.broadcast(topic, event, payload) do
      :ok ->
        :ok

      {:error, reason} ->
        Logger.warning("Failed to broadcast #{event} to #{topic}: #{inspect(reason)}")
        {:error, reason}
    end
  end

  defp serialize_document(document) do
    %{
      id: document.id,
      title: document.title,
      created_at: document.inserted_at,
      updated_at: document.updated_at
    }
  end
end
