defmodule Mindrian.Chat.Tools.CreateDocument do
  @moduledoc """
  Tool for creating new documents in the user's workspace.
  """
  use Mindrian.Chat.Tool

  alias Mindrian.Documents
  alias Mindrian.Collaboration.DocServer

  @impl true
  def name, do: "create_document"

  @impl true
  def description, do: "Create a new document in the user's workspace."

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        title: %{
          type: "string",
          description: "The title for the new document"
        }
      },
      required: ["title"]
    }
  end

  @impl true
  def execute(input, scope) do
    title = input["title"] || "Untitled"
    workspace_id = input["workspace_id"]

    case Documents.create_document(scope, %{title: title, workspace_id: workspace_id}) do
      {:ok, document} ->
        # Insert initial heading with document title
        DocServer.apply_block_operations(document.id, [
          %{"type" => "append_block", "block" => %{"type" => "heading", "content" => title}}
        ])

        {:ok, %{document_id: document.id, title: document.title}}

      {:error, changeset} ->
        {:error, "Failed to create document: #{inspect(changeset.errors)}"}
    end
  end

  @impl true
  def describe_action(input) do
    title = input["title"] || "Untitled"
    "Create a new document titled \"#{title}\""
  end
end
