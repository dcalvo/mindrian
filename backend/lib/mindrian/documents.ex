defmodule Mindrian.Documents do
  @moduledoc """
  The Documents context for managing collaborative documents and folders.
  """
  import Ecto.Query

  alias Mindrian.Repo
  alias Mindrian.Accounts.Scope
  alias Mindrian.Documents.{Document, Folder, Workspace}
  alias Mindrian.Collaboration.YjsDocument
  alias MindrianWeb.DocumentsChannel

  # =============================================================================
  # LIST OPERATIONS
  # =============================================================================

  @doc """
  Lists all workspaces for the given scope's user.
  """
  def list_workspaces(%Scope{user: user}) do
    from(w in Workspace,
      where: w.owner_id == ^user.id,
      order_by: [desc: w.updated_at]
    )
    |> Repo.all()
  end

  @doc """
  Lists all folders for the given scope's user, ordered by parent then position.
  Optionally filters by workspace_id.
  When workspace_id is provided, only returns folders with that workspace_id.
  When workspace_id is nil, excludes folders with NULL workspace_id (legacy items).
  """
  def list_folders(%Scope{user: user}, workspace_id \\ nil) do
    query =
      from(f in Folder,
        where: f.user_id == ^user.id,
        order_by: [asc: f.position, desc: f.updated_at]
      )

    query =
      if workspace_id do
        # Only return folders with the specific workspace_id
        from(f in query, where: f.workspace_id == ^workspace_id)
      else
        # Exclude folders with NULL workspace_id (these are legacy items)
        from(f in query, where: not is_nil(f.workspace_id))
      end

    Repo.all(query)
  end

  @doc """
  Lists all documents for the given scope's user, ordered by folder then position.
  Optionally filters by workspace_id.
  When workspace_id is provided, only returns documents with that workspace_id.
  When workspace_id is nil, excludes documents with NULL workspace_id (legacy items).
  """
  def list_documents(%Scope{user: user}, workspace_id \\ nil) do
    query =
      from(d in Document,
        where: d.user_id == ^user.id,
        order_by: [asc: d.position, desc: d.updated_at]
      )

    query =
      if workspace_id do
        # Only return documents with the specific workspace_id
        from(d in query, where: d.workspace_id == ^workspace_id)
      else
        # Exclude documents with NULL workspace_id (these are legacy items)
        from(d in query, where: not is_nil(d.workspace_id))
      end

    Repo.all(query)
  end

  @doc """
  Lists all folders and documents for the given scope's user.
  Optionally filters by workspace_id.
  Returns a map with :folders and :documents keys.
  """
  def list_all(%Scope{} = scope, workspace_id \\ nil) do
    %{
      folders: list_folders(scope, workspace_id),
      documents: list_documents(scope, workspace_id)
    }
  end

  @doc """
  Searches documents by title using case-insensitive ILIKE matching.
  Optionally filters by workspace_id.
  Returns matching documents with their IDs, titles, and timestamps.
  """
  def search_documents(%Scope{user: user}, query, workspace_id \\ nil) do
    search_term = "%#{query}%"

    base_query =
      from(d in Document,
        where: d.user_id == ^user.id,
        where: ilike(d.title, ^search_term),
        order_by: [desc: d.updated_at]
      )

    base_query =
      if workspace_id do
        from(d in base_query, where: d.workspace_id == ^workspace_id)
      else
        from(d in base_query, where: not is_nil(d.workspace_id))
      end

    Repo.all(base_query)
  end

  @doc """
  Gets a summary of a workspace including document/folder counts and recent activity.
  """
  def get_workspace_summary(%Scope{user: user} = scope, workspace_id) do
    case get_workspace(scope, workspace_id) do
      nil ->
        nil

      workspace ->
        document_count =
          from(d in Document,
            where: d.user_id == ^user.id and d.workspace_id == ^workspace_id,
            select: count(d.id)
          )
          |> Repo.one()

        folder_count =
          from(f in Folder,
            where: f.user_id == ^user.id and f.workspace_id == ^workspace_id,
            select: count(f.id)
          )
          |> Repo.one()

        recent_documents =
          from(d in Document,
            where: d.user_id == ^user.id and d.workspace_id == ^workspace_id,
            order_by: [desc: d.updated_at],
            limit: 5,
            select: %{id: d.id, title: d.title, updated_at: d.updated_at}
          )
          |> Repo.all()

        %{
          workspace: %{
            id: workspace.id,
            title: workspace.title,
            created_at: workspace.inserted_at,
            updated_at: workspace.updated_at
          },
          document_count: document_count,
          folder_count: folder_count,
          recent_documents: recent_documents
        }
    end
  end

  # =============================================================================
  # GET OPERATIONS
  # =============================================================================

  @doc """
  Gets a single workspace by ID, scoped to the user.
  """
  def get_workspace(%Scope{user: user}, id) do
    from(w in Workspace,
      where: w.id == ^id and w.owner_id == ^user.id
    )
    |> Repo.one()
  end

  @doc """
  Gets a single folder by ID, scoped to the user.
  """
  def get_folder(%Scope{user: user}, id) do
    from(f in Folder,
      where: f.id == ^id and f.user_id == ^user.id
    )
    |> Repo.one()
  end

  @doc """
  Gets a single document by ID, scoped to the user.
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

  # =============================================================================
  # CREATE OPERATIONS
  # =============================================================================

  @doc """
  Creates a workspace for the given scope's user.
  """
  def create_workspace(%Scope{user: user}, attrs \\ %{}) do
    %Workspace{owner_id: user.id}
    |> Workspace.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Creates a folder for the given scope's user.
  """
  def create_folder(%Scope{user: user}, attrs \\ %{}) do
    parent_folder_id = attrs["parent_folder_id"] || attrs[:parent_folder_id]
    workspace_id = attrs["workspace_id"] || attrs[:workspace_id]
    position = next_folder_position(user.id, parent_folder_id, workspace_id)

    result =
      %Folder{user_id: user.id, position: position}
      |> Folder.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, folder} ->
        DocumentsChannel.broadcast_folder_created(user.id, folder)
        {:ok, folder}

      error ->
        error
    end
  end

  @doc """
  Creates a document for the given scope's user.
  """
  def create_document(%Scope{user: user}, attrs \\ %{}) do
    folder_id = attrs["folder_id"] || attrs[:folder_id]
    workspace_id = attrs["workspace_id"] || attrs[:workspace_id]
    position = next_document_position(user.id, folder_id, workspace_id)

    result =
      %Document{user_id: user.id, position: position}
      |> Document.changeset(attrs)
      |> Repo.insert()

    case result do
      {:ok, document} ->
        DocumentsChannel.broadcast_document_created(user.id, document)
        {:ok, document}

      error ->
        error
    end
  end

  # =============================================================================
  # UPDATE OPERATIONS
  # =============================================================================

  @doc """
  Updates a workspace.
  """
  def update_workspace(%Workspace{} = workspace, attrs) do
    workspace
    |> Workspace.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Updates a folder (title, etc).
  """
  def update_folder(%Folder{} = folder, attrs) do
    result =
      folder
      |> Folder.changeset(attrs)
      |> Repo.update()

    case result do
      {:ok, updated_folder} ->
        DocumentsChannel.broadcast_folder_updated(folder.user_id, updated_folder)
        {:ok, updated_folder}

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
        DocumentsChannel.broadcast_document_updated(document.user_id, updated_document)
        {:ok, updated_document}

      error ->
        error
    end
  end

  # =============================================================================
  # MOVE OPERATIONS
  # =============================================================================

  @doc """
  Moves a folder to a new parent folder and/or position.
  """
  def move_folder(%Scope{user: user}, id, attrs) do
    parent_folder_id = attrs["parent_folder_id"] || attrs[:parent_folder_id]
    position = attrs["position"] || attrs[:position] || 0

    with %Folder{} = folder <- get_folder(%Scope{user: user}, id),
         :ok <- validate_folder_not_circular(folder, parent_folder_id),
         {:ok, folder} <- do_move_folder(folder, parent_folder_id, position) do
      DocumentsChannel.broadcast_folder_moved(user.id, folder)
      {:ok, folder}
    end
  end

  @doc """
  Moves a document to a new folder and/or position.
  """
  def move_document(%Scope{user: user}, id, attrs) do
    folder_id = attrs["folder_id"] || attrs[:folder_id]
    position = attrs["position"] || attrs[:position] || 0

    with %Document{} = document <- get_document(%Scope{user: user}, id),
         {:ok, document} <- do_move_document(document, folder_id, position) do
      DocumentsChannel.broadcast_document_moved(user.id, document)
      {:ok, document}
    end
  end

  # =============================================================================
  # DELETE OPERATIONS
  # =============================================================================

  @doc """
  Deletes a workspace.
  """
  def delete_workspace(%Workspace{} = workspace) do
    Repo.delete(workspace)
  end

  @doc """
  Deletes a folder and all its contents recursively.
  """
  def delete_folder(%Folder{} = folder) do
    # Delete child folders recursively
    from(f in Folder, where: f.parent_folder_id == ^folder.id)
    |> Repo.all()
    |> Enum.each(&delete_folder/1)

    # Delete documents in this folder
    from(d in Document, where: d.folder_id == ^folder.id)
    |> Repo.all()
    |> Enum.each(&delete_document/1)

    result = Repo.delete(folder)

    case result do
      {:ok, _deleted_folder} ->
        DocumentsChannel.broadcast_folder_deleted(folder.user_id, folder.id)
        result

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
        DocumentsChannel.broadcast_document_deleted(document.user_id, document.id)
        result

      error ->
        error
    end
  end

  # =============================================================================
  # CHANGESET
  # =============================================================================

  @doc """
  Returns a changeset for tracking workspace changes.
  """
  def change_workspace(%Workspace{} = workspace, attrs \\ %{}) do
    Workspace.changeset(workspace, attrs)
  end

  @doc """
  Returns a changeset for tracking document changes.
  """
  def change_document(%Document{} = document, attrs \\ %{}) do
    Document.changeset(document, attrs)
  end

  @doc """
  Returns a changeset for tracking folder changes.
  """
  def change_folder(%Folder{} = folder, attrs \\ %{}) do
    Folder.changeset(folder, attrs)
  end

  # =============================================================================
  # PRIVATE FUNCTIONS
  # =============================================================================

  defp next_folder_position(user_id, parent_folder_id, workspace_id) do
    query =
      if is_nil(parent_folder_id) do
        base_query =
          from(f in Folder, where: f.user_id == ^user_id and is_nil(f.parent_folder_id))

        if workspace_id do
          from(f in base_query, where: f.workspace_id == ^workspace_id, select: max(f.position))
        else
          from(f in base_query, select: max(f.position))
        end
      else
        base_query =
          from(f in Folder,
            where: f.user_id == ^user_id and f.parent_folder_id == ^parent_folder_id
          )

        if workspace_id do
          from(f in base_query, where: f.workspace_id == ^workspace_id, select: max(f.position))
        else
          from(f in base_query, select: max(f.position))
        end
      end

    query
    |> Repo.one()
    |> case do
      nil -> 0
      max -> max + 1
    end
  end

  defp next_document_position(user_id, folder_id, workspace_id) do
    query =
      if is_nil(folder_id) do
        base_query = from(d in Document, where: d.user_id == ^user_id and is_nil(d.folder_id))

        if workspace_id do
          from(d in base_query, where: d.workspace_id == ^workspace_id, select: max(d.position))
        else
          from(d in base_query, select: max(d.position))
        end
      else
        base_query =
          from(d in Document, where: d.user_id == ^user_id and d.folder_id == ^folder_id)

        if workspace_id do
          from(d in base_query, where: d.workspace_id == ^workspace_id, select: max(d.position))
        else
          from(d in base_query, select: max(d.position))
        end
      end

    query
    |> Repo.one()
    |> case do
      nil -> 0
      max -> max + 1
    end
  end

  defp validate_folder_not_circular(%Folder{id: id}, parent_folder_id)
       when id == parent_folder_id do
    {:error, :circular_reference}
  end

  defp validate_folder_not_circular(%Folder{id: id}, parent_folder_id)
       when not is_nil(parent_folder_id) do
    if is_folder_descendant?(parent_folder_id, id) do
      {:error, :circular_reference}
    else
      :ok
    end
  end

  defp validate_folder_not_circular(_folder, _parent_folder_id), do: :ok

  defp is_folder_descendant?(child_id, ancestor_id) do
    case Repo.get(Folder, child_id) do
      nil -> false
      %Folder{parent_folder_id: nil} -> false
      %Folder{parent_folder_id: ^ancestor_id} -> true
      %Folder{parent_folder_id: parent_id} -> is_folder_descendant?(parent_id, ancestor_id)
    end
  end

  defp do_move_folder(folder, parent_folder_id, position) do
    folder
    |> Folder.changeset(%{parent_folder_id: parent_folder_id, position: position})
    |> Repo.update()
  end

  defp do_move_document(document, folder_id, position) do
    document
    |> Document.changeset(%{folder_id: folder_id, position: position})
    |> Repo.update()
  end
end
