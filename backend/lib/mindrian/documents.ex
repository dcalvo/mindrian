defmodule Mindrian.Documents do
  @moduledoc """
  The Documents context for managing collaborative documents and folders.
  """
  import Ecto.Query

  alias Mindrian.Repo
  alias Mindrian.Accounts.Scope
  alias Mindrian.Documents.Document
  alias Mindrian.Collaboration.YjsDocument
  alias MindrianWeb.DocumentsChannel

  @doc """
  Lists all documents for the given scope's user, ordered by parent then position.
  Returns a flat list - tree structure is built client-side.
  """
  def list_documents(%Scope{user: user}) do
    from(d in Document,
      where: d.user_id == ^user.id,
      order_by: [asc: d.parent_id, asc: d.position, desc: d.updated_at]
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
  Creates a document (file) for the given scope's user.
  """
  def create_document(%Scope{user: user}, attrs \\ %{}) do
    position = next_position(user.id, attrs["parent_id"] || attrs[:parent_id])

    result =
      %Document{user_id: user.id, is_folder: false, position: position}
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
  Creates a folder for the given scope's user.
  """
  def create_folder(%Scope{user: user}, attrs \\ %{}) do
    position = next_position(user.id, attrs["parent_id"] || attrs[:parent_id])

    result =
      %Document{user_id: user.id, is_folder: true, position: position}
      |> Document.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, folder} ->
        DocumentsChannel.broadcast_created(user.id, folder)
        {:ok, folder}

      error ->
        error
    end
  end

  @doc """
  Updates a document (title, etc).
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
  Moves a document/folder to a new parent and/or position.
  Reorders siblings as needed.
  """
  def move_document(%Scope{user: user}, id, attrs) do
    parent_id = attrs["parent_id"] || attrs[:parent_id]
    position = attrs["position"] || attrs[:position] || 0

    with %Document{} = document <- get_document(%Scope{user: user}, id),
         :ok <- validate_not_circular(document, parent_id),
         {:ok, document} <- do_move(document, parent_id, position) do
      DocumentsChannel.broadcast_moved(user.id, document)
      {:ok, document}
    end
  end

  @doc """
  Deletes a document and its associated Yjs updates.
  If deleting a folder, also deletes all children recursively.
  """
  def delete_document(%Document{} = document) do
    # Delete children first if this is a folder
    if document.is_folder do
      from(d in Document, where: d.parent_id == ^document.id)
      |> Repo.all()
      |> Enum.each(&delete_document/1)
    end

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

  # Private functions

  defp next_position(user_id, parent_id) do
    query =
      if is_nil(parent_id) do
        from(d in Document,
          where: d.user_id == ^user_id and is_nil(d.parent_id),
          select: max(d.position)
        )
      else
        from(d in Document,
          where: d.user_id == ^user_id and d.parent_id == ^parent_id,
          select: max(d.position)
        )
      end

    query
    |> Repo.one()
    |> case do
      nil -> 0
      max -> max + 1
    end
  end

  defp validate_not_circular(%Document{id: id}, parent_id) when id == parent_id do
    {:error, :circular_reference}
  end

  defp validate_not_circular(%Document{id: id}, parent_id) when not is_nil(parent_id) do
    # Check if parent_id is a descendant of document
    if is_descendant?(parent_id, id) do
      {:error, :circular_reference}
    else
      :ok
    end
  end

  defp validate_not_circular(_document, _parent_id), do: :ok

  defp is_descendant?(child_id, ancestor_id) do
    case Repo.get(Document, child_id) do
      nil -> false
      %Document{parent_id: nil} -> false
      %Document{parent_id: ^ancestor_id} -> true
      %Document{parent_id: parent_id} -> is_descendant?(parent_id, ancestor_id)
    end
  end

  defp do_move(document, parent_id, position) do
    document
    |> Document.changeset(%{parent_id: parent_id, position: position})
    |> Repo.update()
  end
end
