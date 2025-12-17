defmodule Mindrian.Collaboration.YjsDocument do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  schema "yjs_documents" do
    field :doc_name, :string
    field :value, :binary
    field :version, :string

    timestamps(type: :utc_datetime)
  end

  def changeset(doc, attrs) do
    doc
    |> cast(attrs, [:doc_name, :value, :version])
    |> validate_required([:doc_name, :value, :version])
  end
end
