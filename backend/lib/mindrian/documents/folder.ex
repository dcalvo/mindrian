defmodule Mindrian.Documents.Folder do
  @moduledoc """
  Schema for folders in the document workspace.
  Folders can contain documents and other folders (via parent_folder_id).
  """
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "folders" do
    field :title, :string, default: "New Folder"
    field :position, :integer, default: 0

    belongs_to :user, Mindrian.Accounts.User
    belongs_to :parent_folder, __MODULE__
    belongs_to :workspace, Mindrian.Documents.Workspace

    timestamps(type: :utc_datetime)
  end

  def changeset(folder, attrs) do
    folder
    |> cast(attrs, [:title, :parent_folder_id, :position, :workspace_id])
    |> validate_required([:title])
    |> validate_length(:title, min: 1, max: 255)
    |> foreign_key_constraint(:parent_folder_id)
    |> foreign_key_constraint(:workspace_id)
  end
end
