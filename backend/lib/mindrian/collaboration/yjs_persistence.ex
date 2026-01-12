defmodule Mindrian.Collaboration.YjsPersistence do
  @moduledoc """
  Persistence layer for Yjs documents.

  Implements the Yex.Sync.SharedDoc.PersistenceBehaviour to store Yjs updates
  in PostgreSQL. Updates are batched and flushed by DocServer after a debounce
  period to reduce DB writes during active editing.
  """
  @behaviour Yex.Sync.SharedDoc.PersistenceBehaviour

  require Logger
  import Ecto.Query
  alias Mindrian.Repo
  alias Mindrian.Collaboration.YjsDocument
  alias Mindrian.Documents.Document

  @impl true
  def bind(_state, doc_name, doc) do
    # Load existing state from DB and apply to the doc
    ecto_doc = get_y_doc(doc_name)

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

  @doc """
  Loads a Yjs document from the database by applying all stored updates.
  Returns a Yex.Doc struct with the full document state.
  """
  def get_y_doc(doc_name) do
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

  @doc """
  Batch insert updates and update document content_text for full-text search.
  Called by DocServer after the debounce period.
  """
  def flush_updates(doc_name, updates, doc) do
    Repo.transaction(fn ->
      # Insert all Yjs updates
      Enum.each(updates, &insert_update(doc_name, &1))

      # Update content_text for full-text search (trigger handles tsvector)
      update_content_text(doc_name, doc)
    end)
  end

  defp update_content_text(doc_name, doc) do
    case Repo.get(Document, doc_name) do
      nil ->
        # Document doesn't exist yet or was deleted
        :ok

      document ->
        content = extract_full_text(doc)

        document
        |> Document.content_changeset(%{content_text: content})
        |> Repo.update()
    end
  end

  @doc """
  Extract all text content from a Yjs document.
  Used for populating content_text for full-text search.
  """
  def extract_full_text(doc) do
    fragment = Yex.Doc.get_xml_fragment(doc, "document-store")
    do_extract_text(fragment)
  end

  defp do_extract_text(%Yex.XmlFragment{} = fragment) do
    fragment
    |> Yex.XmlFragment.children()
    |> Enum.map(&do_extract_text/1)
    |> Enum.join("\n")
  end

  defp do_extract_text(%Yex.XmlElement{} = elem) do
    elem
    |> Yex.XmlElement.children()
    |> Enum.map(&do_extract_text/1)
    |> Enum.join("")
  end

  defp do_extract_text(%Yex.XmlText{} = text) do
    Yex.XmlText.to_string(text)
  end

  defp do_extract_text(_other), do: ""
end
