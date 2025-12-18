defmodule Mindrian.Agent.Tools.EditDocument do
  @moduledoc """
  Tool for editing document content through block-level operations.
  """
  use Mindrian.Agent.Tool

  alias Mindrian.Documents
  alias Mindrian.Collaboration.DocServer

  @impl true
  def name, do: "edit_document"

  @impl true
  def description do
    """
    Edit a document by applying block-level operations.
    Operations are applied in order. Available operation types:
    - insert_block: Insert a new block after a specified block (or at the start if after_id is not provided)
    - delete_block: Remove a block by ID
    - update_block: Update the content of an existing block
    - append_block: Add a new block at the end of the document
    """
  end

  @impl true
  def input_schema do
    %{
      type: "object",
      properties: %{
        document_id: %{
          type: "string",
          description: "The ID of the document to edit"
        },
        operations: %{
          type: "array",
          description: "List of operations to apply to the document",
          items: %{
            type: "object",
            properties: %{
              type: %{
                type: "string",
                enum: ["insert_block", "delete_block", "update_block", "append_block"],
                description: "The type of operation"
              },
              block_id: %{
                type: "string",
                description: "The ID of the block (for delete_block and update_block)"
              },
              after_id: %{
                type: "string",
                description: "The ID of the block to insert after (for insert_block)"
              },
              block: %{
                type: "object",
                description: "The block data (for insert_block and append_block)",
                properties: %{
                  type: %{
                    type: "string",
                    description: "Block type (e.g., 'paragraph', 'heading', 'bulletListItem')"
                  },
                  content: %{
                    type: "string",
                    description: "The text content of the block"
                  }
                }
              },
              content: %{
                type: "string",
                description: "New content for the block (for update_block)"
              }
            },
            required: ["type"]
          }
        }
      },
      required: ["document_id", "operations"]
    }
  end

  @impl true
  def execute(input, scope) do
    document_id = input["document_id"]
    operations = input["operations"] || []

    case Documents.get_document(scope, document_id) do
      nil ->
        {:error, "Document not found or not authorized"}

      _document ->
        case DocServer.apply_block_operations(document_id, operations) do
          :ok ->
            {:ok, %{document_id: document_id, operations_applied: length(operations)}}

          {:error, reason} ->
            {:error, "Failed to apply operations: #{inspect(reason)}"}
        end
    end
  end

  @impl true
  def describe_action(input) do
    ops_count = length(input["operations"] || [])
    "Edit document #{input["document_id"]} (#{ops_count} operation(s))"
  end
end
