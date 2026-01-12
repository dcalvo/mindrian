defmodule Mindrian.Documents.Document do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "documents" do
    field :title, :string, default: "Untitled"
    field :position, :integer, default: 0
    field :content_text, :string

    belongs_to :user, Mindrian.Accounts.User
    belongs_to :folder, Mindrian.Documents.Folder
    belongs_to :workspace, Mindrian.Documents.Workspace

    timestamps(type: :utc_datetime)
  end

  def changeset(document, attrs) do
    document
    |> cast(attrs, [:title, :folder_id, :position, :workspace_id])
    |> validate_required([:title])
    |> validate_length(:title, min: 1, max: 255)
    |> foreign_key_constraint(:folder_id)
    |> foreign_key_constraint(:workspace_id)
  end

  @doc """
  Changeset for updating content_text (used by YjsPersistence on flush).
  """
  def content_changeset(document, attrs) do
    cast(document, attrs, [:content_text])
  end
end
