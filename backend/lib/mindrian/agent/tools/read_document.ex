defmodule Mindrian.Agent.Tools.ReadDocument do
  @moduledoc """
  Tool for reading document content.
  """
  use Mindrian.Agent.Tool

  alias Mindrian.Documents
  alias Mindrian.Collaboration.DocServer

  @impl true
  def name, do: "read_document"

  @impl true
  def description do
    "Read the content of a document. Returns the document's blocks as structured data."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        document_id: %{
          type: "string",
          description: "The ID of the document to read"
        }
      },
      required: ["document_id"]
    }
  end

  @impl true
  def execute(input, scope) do
    document_id = input["document_id"]

    case Documents.get_document(scope, document_id) do
      nil ->
        {:error, "Document not found or not authorized"}

      document ->
        case DocServer.get_blocks(document_id) do
          {:ok, blocks} ->
            {:ok, %{document_id: document.id, title: document.title, blocks: blocks}}

          {:error, reason} ->
            {:error, "Failed to read document: #{inspect(reason)}"}
        end
    end
  end

  @impl true
  def describe_action(input) do
    "Read document #{input["document_id"]}"
  end
end
