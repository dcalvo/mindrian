defmodule Mindrian.Documents.DocumentCollaborator do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "document_collaborators" do
    field :role, :string, default: "editor"
    belongs_to :document, Mindrian.Documents.Document
    belongs_to :user, Mindrian.Accounts.User

    timestamps(type: :utc_datetime)
  end

  def changeset(collaborator, attrs) do
    collaborator
    |> cast(attrs, [:role])
    |> validate_required([:role])
    |> validate_inclusion(:role, ["editor", "viewer"])
  end
end
