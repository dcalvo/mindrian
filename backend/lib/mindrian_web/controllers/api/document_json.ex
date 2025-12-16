defmodule MindrianWeb.API.DocumentJSON do
  alias Mindrian.Documents.Document

  def index(%{documents: documents}) do
    %{documents: for(document <- documents, do: data(document))}
  end

  def show(%{document: document}) do
    %{document: data(document)}
  end

  def error(%{changeset: changeset}) do
    %{errors: Ecto.Changeset.traverse_errors(changeset, &translate_error/1)}
  end

  defp data(%Document{} = document) do
    %{
      id: document.id,
      title: document.title,
      created_at: document.inserted_at,
      updated_at: document.updated_at
    }
  end

  defp translate_error({msg, opts}) do
    Enum.reduce(opts, msg, fn {key, value}, acc ->
      String.replace(acc, "%{#{key}}", to_string(value))
    end)
  end
end
