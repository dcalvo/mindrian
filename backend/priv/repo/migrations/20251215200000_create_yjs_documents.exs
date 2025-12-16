defmodule Mindrian.Repo.Migrations.CreateYjsDocuments do
  use Ecto.Migration

  def change do
    create table(:yjs_documents, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :doc_name, :string, null: false
      add :value, :binary, null: false
      add :version, :string, null: false

      timestamps(type: :utc_datetime)
    end

    create index(:yjs_documents, [:doc_name, :version])
    create index(:yjs_documents, [:doc_name, :inserted_at])
  end
end
