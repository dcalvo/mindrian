defmodule Mindrian.Repo.Migrations.SeparateFoldersAndDocuments do
  use Ecto.Migration

  def up do
    # 1. Create folders table
    create table(:folders, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false, default: "New Folder"
      add :position, :integer, null: false, default: 0
      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      add :parent_folder_id, references(:folders, type: :binary_id, on_delete: :delete_all)

      timestamps(type: :utc_datetime)
    end

    create index(:folders, [:user_id])
    create index(:folders, [:parent_folder_id])
    create index(:folders, [:user_id, :parent_folder_id, :position])

    # 2. Add folder_id column to documents (will migrate data next)
    alter table(:documents) do
      add :folder_id, references(:folders, type: :binary_id, on_delete: :delete_all)
    end

    create index(:documents, [:folder_id])

    # 3. Migrate existing folders from documents to folders table
    execute """
    INSERT INTO folders (id, title, position, user_id, parent_folder_id, inserted_at, updated_at)
    SELECT id, title, position, user_id, parent_id, inserted_at, updated_at
    FROM documents
    WHERE is_folder = true
    """

    # 4. Update documents' folder_id to reference their parent folder
    # (only for documents that had a parent which was a folder)
    execute """
    UPDATE documents
    SET folder_id = parent_id
    WHERE parent_id IS NOT NULL
      AND is_folder = false
      AND EXISTS (SELECT 1 FROM folders WHERE folders.id = documents.parent_id)
    """

    # 5. Delete the migrated folders from documents table
    execute """
    DELETE FROM documents WHERE is_folder = true
    """

    # 6. Remove old columns from documents
    alter table(:documents) do
      remove :is_folder
      remove :parent_id
    end
  end

  def down do
    # 1. Add back old columns to documents
    alter table(:documents) do
      add :is_folder, :boolean, default: false
      add :parent_id, references(:documents, type: :binary_id, on_delete: :delete_all)
    end

    # 2. Set folder_id references back to parent_id
    execute """
    UPDATE documents
    SET parent_id = folder_id
    WHERE folder_id IS NOT NULL
    """

    # 3. Migrate folders back to documents table
    execute """
    INSERT INTO documents (id, title, position, user_id, parent_id, is_folder, inserted_at, updated_at)
    SELECT id, title, position, user_id, parent_folder_id, true, inserted_at, updated_at
    FROM folders
    """

    # 4. Remove folder_id column
    alter table(:documents) do
      remove :folder_id
    end

    # 5. Drop folders table
    drop table(:folders)
  end
end
