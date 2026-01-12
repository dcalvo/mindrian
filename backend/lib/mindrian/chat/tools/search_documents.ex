defmodule Mindrian.Chat.Tools.SearchDocuments do
  @moduledoc """
  Tool for searching documents by title and content using full-text search.
  """
  use Mindrian.Chat.Tool

  alias Mindrian.Documents

  @impl true
  def name, do: "search_documents"

  @impl true
  def description do
    "Search documents by title and content. Returns matching documents ranked by relevance."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        query: %{
          type: "string",
          description: "Search query to match against document titles and content"
        }
      },
      required: ["query"]
    }
  end

  @impl true
  def execute(input, scope) do
    query = input["query"]
    workspace_id = input["workspace_id"]
    documents = Documents.search_documents(scope, query, workspace_id)

    result =
      Enum.map(documents, fn doc ->
        %{
          document_id: doc.id,
          title: doc.title,
          snippet: doc.headline,
          created_at: doc.inserted_at,
          updated_at: doc.updated_at
        }
      end)

    {:ok, %{documents: result, count: length(result), query: query}}
  end

  @impl true
  def describe_action(input) do
    "Search documents for \"#{input["query"]}\""
  end
end
