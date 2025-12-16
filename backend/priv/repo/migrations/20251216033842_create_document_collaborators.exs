defmodule Mindrian.Repo.Migrations.CreateDocumentCollaborators do
  use Ecto.Migration

  def change do
    create table(:document_collaborators, primary_key: false) do
      add :id, :binary_id, primary_key: true

      add :document_id, references(:documents, type: :binary_id, on_delete: :delete_all),
        null: false

      add :user_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false
      add :role, :string, null: false, default: "editor"

      timestamps(type: :utc_datetime)
    end

    create index(:document_collaborators, [:document_id])
    create index(:document_collaborators, [:user_id])
    create unique_index(:document_collaborators, [:document_id, :user_id])
  end
end
