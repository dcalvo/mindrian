defmodule Mindrian.Agent.Tools.DeleteDocument do
  @moduledoc """
  Tool for deleting documents from the user's workspace.
  """
  use Mindrian.Agent.Tool

  alias Mindrian.Documents

  @impl true
  def name, do: "delete_document"

  @impl true
  def description do
    "Delete a document from the user's workspace. This action cannot be undone."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        document_id: %{
          type: "string",
          description: "The ID of the document to delete"
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
          case Documents.delete_document(document) do
            {:ok, _} ->
              {:ok, %{deleted: true, document_id: document_id}}

            {:error, reason} ->
              {:error, "Failed to delete document: #{inspect(reason)}"}
          end
      end
    end
  end

  @impl true
  def describe_action(input) do
    "Delete document #{input["document_id"]}"
  end
end
