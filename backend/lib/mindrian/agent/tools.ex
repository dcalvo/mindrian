defmodule Mindrian.Agent.Tools do
  @moduledoc """
  Tool definitions and execution logic for the AI agent.

  Tools allow the agent to interact with the user's documents.
  All tool executions require user approval before running.
  """
  require Logger

  alias Mindrian.Documents
  alias Mindrian.Accounts.Scope

  @doc """
  Returns all available tool definitions in Anthropic's format.
  """
  def definitions do
    [
      create_document_tool(),
      delete_document_tool(),
      read_document_tool(),
      edit_document_tool()
    ]
  end

  @doc """
  Executes a tool with the given input, scoped to the user.

  Returns {:ok, result} or {:error, reason}.
  """
  def execute(tool_name, input, %Scope{} = scope) do
    Logger.info("Executing tool #{tool_name} with input: #{inspect(input)}")

    case tool_name do
      "create_document" -> execute_create_document(input, scope)
      "delete_document" -> execute_delete_document(input, scope)
      "read_document" -> execute_read_document(input, scope)
      "edit_document" -> execute_edit_document(input, scope)
      _ -> {:error, "Unknown tool: #{tool_name}"}
    end
  end

  @doc """
  Returns a human-readable description of the tool action for the approval UI.
  """
  def describe_action(tool_name, input) do
    case tool_name do
      "create_document" ->
        "Create a new document titled \"#{input["title"] || "Untitled"}\""

      "delete_document" ->
        "Delete document #{input["document_id"]}"

      "read_document" ->
        "Read document #{input["document_id"]}"

      "edit_document" ->
        ops_count = length(input["operations"] || [])
        "Edit document #{input["document_id"]} (#{ops_count} operation(s))"

      _ ->
        "Execute #{tool_name}"
    end
  end

  # Tool definitions

  defp create_document_tool do
    %{
      name: "create_document",
      description: "Create a new document in the user's workspace.",
      input_schema: %{
        type: "object",
        properties: %{
          title: %{
            type: "string",
            description: "The title for the new document"
          }
        },
        required: ["title"]
      }
    }
  end

  defp delete_document_tool do
    %{
      name: "delete_document",
      description:
        "Delete a document from the user's workspace. This action cannot be undone.",
      input_schema: %{
        type: "object",
        properties: %{
          document_id: %{
            type: "string",
            description: "The ID of the document to delete"
          }
        },
        required: ["document_id"]
      }
    }
  end

  defp read_document_tool do
    %{
      name: "read_document",
      description:
        "Read the content of a document. Returns the document's blocks as structured data.",
      input_schema: %{
        type: "object",
        properties: %{
          document_id: %{
            type: "string",
            description: "The ID of the document to read"
          }
        },
        required: ["document_id"]
      }
    }
  end

  defp edit_document_tool do
    %{
      name: "edit_document",
      description: """
      Edit a document by applying block-level operations.
      Operations are applied in order. Available operation types:
      - insert_block: Insert a new block after a specified block (or at the start if after_id is not provided)
      - delete_block: Remove a block by ID
      - update_block: Update the content of an existing block
      - append_block: Add a new block at the end of the document
      """,
      input_schema: %{
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
    }
  end

  # Tool execution implementations

  defp execute_create_document(input, scope) do
    title = input["title"] || "Untitled"

    case Documents.create_document(scope, %{title: title}) do
      {:ok, document} ->
        {:ok, %{document_id: document.id, title: document.title}}

      {:error, changeset} ->
        {:error, "Failed to create document: #{inspect(changeset.errors)}"}
    end
  end

  defp execute_delete_document(input, scope) do
    document_id = input["document_id"]

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

  defp execute_read_document(input, scope) do
    document_id = input["document_id"]

    case Documents.get_document(scope, document_id) do
      nil ->
        {:error, "Document not found or not authorized"}

      document ->
        # Get the document content from the Yjs document
        blocks = get_document_blocks(document_id)
        {:ok, %{document_id: document.id, title: document.title, blocks: blocks}}
    end
  end

  defp execute_edit_document(input, scope) do
    document_id = input["document_id"]
    operations = input["operations"] || []

    case Documents.get_document(scope, document_id) do
      nil ->
        {:error, "Document not found or not authorized"}

      _document ->
        case apply_block_operations(document_id, operations) do
          :ok ->
            {:ok, %{document_id: document_id, operations_applied: length(operations)}}

          {:error, reason} ->
            {:error, "Failed to apply operations: #{inspect(reason)}"}
        end
    end
  end

  # Helper functions for document operations

  alias Mindrian.Collaboration.{YjsPersistence, DocServer}

  @doc """
  Reads the blocks from a document's Yjs XmlFragment.
  BlockNote stores blocks in an XmlFragment named "document-store".
  """
  def get_document_blocks(doc_id) do
    ydoc = YjsPersistence.get_y_doc(doc_id)
    # Get fragment OUTSIDE transaction to avoid deadlock
    fragment = Yex.Doc.get_xml_fragment(ydoc, "document-store")

    Yex.Doc.transaction(ydoc, fn ->
      extract_blocks(fragment)
    end)
  end

  defp extract_blocks(fragment) do
    fragment
    |> Yex.XmlFragment.children()
    |> Enum.map(&extract_block/1)
    |> Enum.to_list()
  end

  defp extract_block(%Yex.XmlElement{} = elem) do
    tag = Yex.XmlElement.get_tag(elem)
    attrs = Yex.XmlElement.get_attributes(elem)

    # Extract text content from children
    content = extract_text_content(elem)

    %{
      id: attrs["id"] || attrs["blockId"],
      type: tag,
      props: Map.drop(attrs, ["id", "blockId"]),
      content: content
    }
  end

  defp extract_block(%Yex.XmlText{} = text) do
    %{
      type: "text",
      content: Yex.XmlText.to_string(text)
    }
  end

  defp extract_text_content(elem) do
    elem
    |> Yex.XmlElement.children()
    |> Enum.map(fn
      %Yex.XmlText{} = text -> Yex.XmlText.to_string(text)
      %Yex.XmlElement{} = child -> extract_text_content(child)
    end)
    |> Enum.join("")
  end

  @doc """
  Applies block operations to a document via the DocServer.
  """
  def apply_block_operations(doc_id, operations) do
    DocServer.apply_block_operations(doc_id, operations)
  end
end
