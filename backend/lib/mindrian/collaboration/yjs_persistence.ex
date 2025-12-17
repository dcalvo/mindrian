defmodule Mindrian.Collaboration.YjsPersistence do
  @moduledoc """
  Persistence layer for Yjs documents.

  Implements the Yex.Sync.SharedDoc.PersistenceBehaviour to store Yjs updates
  in PostgreSQL.
  """
  @behaviour Yex.Sync.SharedDoc.PersistenceBehaviour

  import Ecto.Query
  alias Mindrian.Repo
  alias Mindrian.Collaboration.YjsDocument

  @impl true
  def bind(_state, doc_name, doc) do
    # Load existing state from DB and apply to the doc
    ecto_doc = get_y_doc(doc_name)

    {:ok, new_updates} = Yex.encode_state_as_update(doc)
    insert_update(doc_name, new_updates)

    Yex.apply_update(doc, Yex.encode_state_as_update!(ecto_doc))

    %{doc_name: doc_name}
  end

  @impl true
  def unbind(_state, _doc_name, _doc) do
    :ok
  end

  @impl true
  def update_v1(_state, update, doc_name, _doc) do
    insert_update(doc_name, update)
    :ok
  end

  # Private functions

  defp get_y_doc(doc_name) do
    ydoc = Yex.Doc.new()
    updates = get_updates(doc_name)

    Yex.Doc.transaction(ydoc, fn ->
      Enum.each(updates, fn update ->
        Yex.apply_update(ydoc, update.value)
      end)
    end)

    ydoc
  end

  defp get_updates(doc_name) do
    from(d in YjsDocument,
      where: d.doc_name == ^doc_name and d.version == "v1",
      order_by: d.inserted_at
    )
    |> Repo.all()
  end

  defp insert_update(doc_name, value) do
    Repo.insert!(%YjsDocument{doc_name: doc_name, value: value, version: "v1"})
  end
end
