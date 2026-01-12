defmodule Mindrian.Chat.Tools.OpenDocument do
  @moduledoc """
  Tool for opening a document in the user's editor.
  This validates the document exists and signals the frontend to open it.
  """
  use Mindrian.Chat.Tool

  alias Mindrian.Documents

  @impl true
  def name, do: "open_document"

  @impl true
  def description do
    "Open a document in the user's editor. Use this to show the user a relevant document."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        document_id: %{
          type: "string",
          description: "The ID of the document to open"
        }
      },
      required: ["document_id"]
    }
  end

  @impl true
  def execute(input, scope) do
    document_id = input["document_id"]

    if is_nil(document_id) do
      {:error, "document_id is required"}
    else
      case Documents.get_document(scope, document_id) do
        nil ->
          {:error, "Document not found or not authorized"}

        document ->
          {:ok, %{document_id: document.id, title: document.title}}
      end
    end
  end

  @impl true
  def describe_action(input) do
    "Open document #{input["document_id"]}"
  end
end
