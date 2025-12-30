defmodule MindrianWeb.DocumentsChannel do
  use MindrianWeb, :channel
  require Logger

  @impl true
  def join("documents:" <> requested_user_id, _payload, socket) do
    if to_string(socket.assigns.user_id) == requested_user_id do
      {:ok, socket}
    else
      {:error, %{reason: "forbidden"}}
    end
  end

  # =============================================================================
  # FOLDER BROADCASTS
  # =============================================================================

  def broadcast_folder_created(user_id, folder) do
    broadcast_event(user_id, "folder_created", %{folder: serialize_folder(folder)})
  end

  def broadcast_folder_updated(user_id, folder) do
    broadcast_event(user_id, "folder_updated", %{folder: serialize_folder(folder)})
  end

  def broadcast_folder_moved(user_id, folder) do
    broadcast_event(user_id, "folder_moved", %{folder: serialize_folder(folder)})
  end

  def broadcast_folder_deleted(user_id, folder_id) do
    broadcast_event(user_id, "folder_deleted", %{id: folder_id})
  end

  # =============================================================================
  # DOCUMENT BROADCASTS
  # =============================================================================

  def broadcast_document_created(user_id, document) do
    broadcast_event(user_id, "document_created", %{document: serialize_document(document)})
  end

  def broadcast_document_updated(user_id, document) do
    broadcast_event(user_id, "document_updated", %{document: serialize_document(document)})
  end

  def broadcast_document_moved(user_id, document) do
    broadcast_event(user_id, "document_moved", %{document: serialize_document(document)})
  end

  def broadcast_document_deleted(user_id, document_id) do
    broadcast_event(user_id, "document_deleted", %{id: document_id})
  end

  # =============================================================================
  # PRIVATE
  # =============================================================================

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

  defp serialize_folder(folder) do
    %{
      id: folder.id,
      title: folder.title,
      parent_folder_id: folder.parent_folder_id,
      position: folder.position,
      type: "folder",
      created_at: folder.inserted_at,
      updated_at: folder.updated_at
    }
  end

  defp serialize_document(document) do
    %{
      id: document.id,
      title: document.title,
      folder_id: document.folder_id,
      position: document.position,
      type: "document",
      created_at: document.inserted_at,
      updated_at: document.updated_at
    }
  end
end
