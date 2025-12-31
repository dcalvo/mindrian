defmodule MindrianWeb.API.DocumentJSON do
  alias Mindrian.Documents.{Document, Folder}

  def index(%{folders: folders, documents: documents}) do
    %{
      folders: for(folder <- folders, do: data_folder(folder)),
      documents: for(document <- documents, do: data_document(document))
    }
  end

  def show(%{item: %Folder{} = folder}) do
    %{folder: data_folder(folder)}
  end

  def show(%{item: %Document{} = document}) do
    %{document: data_document(document)}
  end

  def error(%{changeset: changeset}) do
    %{errors: Ecto.Changeset.traverse_errors(changeset, &translate_error/1)}
  end

  defp data_folder(%Folder{} = folder) do
    %{
      id: folder.id,
      title: folder.title,
      parent_folder_id: folder.parent_folder_id,
      position: folder.position,
      type: "folder",
      created_at: folder.inserted_at,
      updated_at: folder.updated_at
    }
  end

  defp data_document(%Document{} = document) do
    %{
      id: document.id,
      title: document.title,
      folder_id: document.folder_id,
      position: document.position,
      type: "document",
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
