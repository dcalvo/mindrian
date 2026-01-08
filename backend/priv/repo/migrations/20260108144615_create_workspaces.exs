defmodule Mindrian.Repo.Migrations.CreateWorkspaces do
  use Ecto.Migration

  def change do
    create table(:workspaces, primary_key: false) do
      add :id, :binary_id, primary_key: true
      add :title, :string, null: false
      add :icon, :string, null: false, default: "briefcase"
      add :bg_color, :string, null: false, default: "#000000"
      add :icon_color, :string, null: false, default: "#ffffff"
      add :owner_id, references(:users, type: :binary_id, on_delete: :delete_all), null: false

      timestamps(type: :utc_datetime)
    end

    create index(:workspaces, [:owner_id])
    create index(:workspaces, [:owner_id, :updated_at])
  end
end
