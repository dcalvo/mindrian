defmodule Mindrian.Repo.Migrations.AddFolderHierarchy do
  use Ecto.Migration

  def change do
    alter table(:documents) do
      add :parent_id, references(:documents, type: :binary_id, on_delete: :nilify_all)
      add :position, :integer, default: 0, null: false
      add :is_folder, :boolean, default: false, null: false
    end

    create index(:documents, [:parent_id])
    create index(:documents, [:user_id, :parent_id, :position])
  end
end
