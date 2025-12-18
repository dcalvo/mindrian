defmodule Mindrian.Agent.Tools.ListDocuments do
  @moduledoc """
  Tool for listing all documents belonging to a user.
  """
  use Mindrian.Agent.Tool

  alias Mindrian.Documents

  @impl true
  def name, do: "list_documents"

  @impl true
  def description do
    "List all documents in the user's workspace. Returns document IDs, titles, and timestamps."
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{},
      required: []
    }
  end

  @impl true
  def execute(_input, scope) do
    documents = Documents.list_documents(scope)

    result =
      Enum.map(documents, fn doc ->
        %{
          document_id: doc.id,
          title: doc.title,
          created_at: doc.inserted_at,
          updated_at: doc.updated_at
        }
      end)

    {:ok, %{documents: result, count: length(result)}}
  end

  @impl true
  def describe_action(_input) do
    "List all documents"
  end
end
