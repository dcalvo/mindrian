defmodule MindrianWeb.API.DocumentController do
  use MindrianWeb, :controller

  alias Mindrian.Documents
  alias Mindrian.Documents.Document

  def index(conn, _params) do
    documents = Documents.list_documents(conn.assigns.current_scope)
    render(conn, :index, documents: documents)
  end

  def create(conn, %{"document" => document_params}) do
    case Documents.create_document(conn.assigns.current_scope, document_params) do
      {:ok, document} ->
        conn
        |> put_status(:created)
        |> render(:show, document: document)

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
        |> render(:show, document: document)

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    case Documents.get_document(conn.assigns.current_scope, id) do
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Document not found"})

      document ->
        render(conn, :show, document: document)
    end
  end

  def update(conn, %{"id" => id, "document" => document_params}) do
    with %Document{} = document <- Documents.get_document(conn.assigns.current_scope, id),
         {:ok, document} <- Documents.update_document(document, document_params) do
      render(conn, :show, document: document)
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Document not found"})

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(:error, changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    with %Document{} = document <- Documents.get_document(conn.assigns.current_scope, id),
         {:ok, _document} <- Documents.delete_document(document) do
      send_resp(conn, :no_content, "")
    else
      nil ->
        conn
        |> put_status(:not_found)
        |> json(%{error: "Document not found"})

      {:error, _} ->
        conn
        |> put_status(:internal_server_error)
        |> json(%{error: "Failed to delete document"})
    end
  end
end
