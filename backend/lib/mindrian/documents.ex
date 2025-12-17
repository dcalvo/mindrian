defmodule Mindrian.Documents do
  @moduledoc """
  The Documents context for managing collaborative documents.
  """
  import Ecto.Query

  alias Mindrian.Repo
  alias Mindrian.Accounts.Scope
  alias Mindrian.Documents.Document
  alias Mindrian.Collaboration.YjsDocument
  alias MindrianWeb.DocumentsChannel

  @doc """
  Lists all documents for the given scope's user, ordered by most recently updated.
  """
  def list_documents(%Scope{user: user}) do
    from(d in Document,
      where: d.user_id == ^user.id,
      order_by: [desc: d.updated_at]
    )
    |> Repo.all()
  end

  @doc """
  Gets a single document by ID, scoped to the user.
  Returns nil if not found or not owned by user.
  """
  def get_document(%Scope{user: user}, id) do
    from(d in Document,
      where: d.id == ^id and d.user_id == ^user.id
    )
    |> Repo.one()
  end

  @doc """
  Gets a document by ID, raising if not found or not authorized.
  """
  def get_document!(%Scope{user: user}, id) do
    from(d in Document,
      where: d.id == ^id and d.user_id == ^user.id
    )
    |> Repo.one!()
  end

  @doc """
  Creates a document for the given scope's user.
  """
  def create_document(%Scope{user: user}, attrs \\ %{}) do
    result =
      %Document{user_id: user.id}
      |> Document.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, document} ->
        DocumentsChannel.broadcast_created(user.id, document)
        {:ok, document}

      error ->
        error
    end
  end

  @doc """
  Updates a document.
  """
  def update_document(%Document{} = document, attrs) do
    result =
      document
      |> Document.changeset(attrs)
      |> Repo.update()

    case result do
      {:ok, updated_document} ->
        DocumentsChannel.broadcast_updated(document.user_id, updated_document)
        {:ok, updated_document}

      error ->
        error
    end
  end

  @doc """
  Deletes a document and its associated Yjs updates.
  """
  def delete_document(%Document{} = document) do
    # Delete associated Yjs updates (doc_name matches document.id)
    from(y in YjsDocument, where: y.doc_name == ^document.id)
    |> Repo.delete_all()

    result = Repo.delete(document)

    case result do
      {:ok, _deleted_document} ->
        DocumentsChannel.broadcast_deleted(document.user_id, document.id)
        result

      error ->
        error
    end
  end

  @doc """
  Returns a changeset for tracking document changes.
  """
  def change_document(%Document{} = document, attrs \\ %{}) do
    Document.changeset(document, attrs)
  end
end
