defmodule MindrianWeb.API.DocumentController do
  use MindrianWeb, :controller

  alias Mindrian.Documents
  alias Mindrian.Documents.{Document, Folder}

  @doc """
  Lists all folders and documents for the current user.
  Optionally filters by workspace_id query parameter.
  """
  def index(conn, params) do
    workspace_id = params["workspace_id"]
    data = Documents.list_all(conn.assigns.current_scope, workspace_id)
    render(conn, :index, folders: data.folders, documents: data.documents)
  end

  @doc """
  Creates a document or folder based on the is_folder param.
  """
  def create(conn, %{"document" => params}) do
    create_fn =
      if params["is_folder"] do
        &Documents.create_folder/2
      else
        &Documents.create_document/2
      end

    case create_fn.(conn.assigns.current_scope, params) do
      {:ok, item} ->
        conn
        |> put_status(:created)
        |> render(:show, item: item)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def create(conn, _params) do
    case Documents.create_document(conn.assigns.current_scope, %{}) do
      {:ok, document} ->
        conn
        |> put_status(:created)
        |> render(:show, item: document)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Shows a single document or folder by ID.
  """
  def show(conn, %{"id" => id}) do
    scope = conn.assigns.current_scope

    case Documents.get_document(scope, id) do
      %Document{} = document ->
        render(conn, :show, item: document)

      nil ->
        # Try finding as folder
        case Documents.get_folder(scope, id) do
          %Folder{} = folder ->
            render(conn, :show, item: folder)

          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Item not found"})
        end
    end
  end

  @doc """
  Updates a document or folder by ID.
  """
  def update(conn, %{"id" => id, "document" => params}) do
    scope = conn.assigns.current_scope

    case Documents.get_document(scope, id) do
      %Document{} = document ->
        do_update_document(conn, document, params)

      nil ->
        case Documents.get_folder(scope, id) do
          %Folder{} = folder ->
            do_update_folder(conn, folder, params)

          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Item not found"})
        end
    end
  end

  defp do_update_document(conn, document, params) do
    case Documents.update_document(document, params) do
      {:ok, updated} ->
        render(conn, :show, item: updated)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  defp do_update_folder(conn, folder, params) do
    case Documents.update_folder(folder, params) do
      {:ok, updated} ->
        render(conn, :show, item: updated)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  @doc """
  Move a document or folder to new parent/position.
  """
  def move(conn, %{"id" => id, "document" => move_params}) do
    scope = conn.assigns.current_scope

    # Determine if it's a folder or document
    case Documents.get_document(scope, id) do
      %Document{} ->
        do_move_document(conn, scope, id, move_params)

      nil ->
        case Documents.get_folder(scope, id) do
          %Folder{} ->
            do_move_folder(conn, scope, id, move_params)

          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Item not found"})
        end
    end
  end

  defp do_move_document(conn, scope, id, params) do
    case Documents.move_document(scope, id, params) do
      {:ok, document} ->
        render(conn, :show, item: document)

      {:error, changeset} when is_struct(changeset, Ecto.Changeset) ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)

      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Document not found"})
    end
  end

  defp do_move_folder(conn, scope, id, params) do
    case Documents.move_folder(scope, id, params) do
      {:ok, folder} ->
        render(conn, :show, item: folder)

      {:error, :circular_reference} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: "Cannot move a folder into itself or its descendants"})

      {:error, changeset} when is_struct(changeset, Ecto.Changeset) ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)

      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Folder not found"})
    end
  end

  @doc """
  Deletes a document or folder by ID.
  """
  def delete(conn, %{"id" => id}) do
    scope = conn.assigns.current_scope

    case Documents.get_document(scope, id) do
      %Document{} = document ->
        case Documents.delete_document(document) do
          {:ok, _} -> send_resp(conn, :no_content, "")
          {:error, _} ->
            conn
            |> put_status(:internal_server_error)
            |> json(%{error: "Failed to delete document"})
        end

      nil ->
        case Documents.get_folder(scope, id) do
          %Folder{} = folder ->
            case Documents.delete_folder(folder) do
              {:ok, _} -> send_resp(conn, :no_content, "")
              {:error, _} ->
                conn
                |> put_status(:internal_server_error)
                |> json(%{error: "Failed to delete folder"})
            end

          nil ->
            conn
            |> put_status(:not_found)
            |> json(%{error: "Item not found"})
        end
    end
  end
end
