defmodule Mindrian.Documents.Workspace do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "workspaces" do
    field :title, :string
    field :icon, :string, default: "briefcase"
    field :bg_color, :string, default: "#000000"
    field :icon_color, :string, default: "#ffffff"

    belongs_to :owner, Mindrian.Accounts.User, foreign_key: :owner_id
    has_many :documents, Mindrian.Documents.Document
    has_many :folders, Mindrian.Documents.Folder

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(workspace, attrs) do
    workspace
    |> cast(attrs, [:title, :icon, :bg_color, :icon_color, :owner_id])
    |> validate_required([:title, :owner_id])
    |> foreign_key_constraint(:owner_id)
  end
end
