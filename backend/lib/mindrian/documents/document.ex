defmodule Mindrian.Documents.Document do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "documents" do
    field :title, :string, default: "Untitled"
    field :position, :integer, default: 0
    field :is_folder, :boolean, default: false

    belongs_to :user, Mindrian.Accounts.User
    belongs_to :parent, __MODULE__

    timestamps(type: :utc_datetime)
  end

  def changeset(document, attrs) do
    document
    |> cast(attrs, [:title, :parent_id, :position, :is_folder])
    |> validate_required([:title])
    |> validate_length(:title, min: 1, max: 255)
    |> foreign_key_constraint(:parent_id)
  end
end
