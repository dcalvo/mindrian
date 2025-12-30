defmodule Mindrian.Documents.Document do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "documents" do
    field :title, :string, default: "Untitled"
    field :position, :integer, default: 0

    belongs_to :user, Mindrian.Accounts.User
    belongs_to :folder, Mindrian.Documents.Folder

    timestamps(type: :utc_datetime)
  end

  def changeset(document, attrs) do
    document
    |> cast(attrs, [:title, :folder_id, :position])
    |> validate_required([:title])
    |> validate_length(:title, min: 1, max: 255)
    |> foreign_key_constraint(:folder_id)
  end
end
