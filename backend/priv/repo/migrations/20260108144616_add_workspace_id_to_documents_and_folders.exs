defmodule Mindrian.Repo.Migrations.AddWorkspaceIdToDocumentsAndFolders do
  use Ecto.Migration

  def change do
    # Add workspace_id to folders
    alter table(:folders) do
      add :workspace_id, references(:workspaces, type: :binary_id, on_delete: :delete_all)
    end

    # Add workspace_id to documents
    alter table(:documents) do
      add :workspace_id, references(:workspaces, type: :binary_id, on_delete: :delete_all)
    end

    # Create indexes for workspace_id
    create index(:folders, [:workspace_id])
    create index(:documents, [:workspace_id])
  end
end
