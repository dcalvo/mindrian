defmodule Mindrian.Collaboration.DocServerTest do
  use Mindrian.DataCase, async: false

  alias Mindrian.Collaboration.DocServer
  alias Mindrian.Documents

  import Mindrian.AccountsFixtures

  setup do
    user = user_fixture()
    scope = %Mindrian.Accounts.Scope{user: user}

    # Create a test document
    {:ok, document} = Documents.create_document(scope, %{title: "Test Document"})

    on_exit(fn ->
      # Clean up any running DocServers
      case Registry.lookup(Mindrian.DocServerRegistry, document.id) do
        [{pid, _}] -> GenServer.stop(pid, :normal, 5000)
        [] -> :ok
      end
    end)

    %{document: document, scope: scope}
  end

  describe "block props" do
    test "append_block creates paragraph with default props", %{document: doc} do
      operations = [
        %{
          "type" => "append_block",
          "block" => %{"type" => "paragraph", "content" => "Hello world"}
        }
      ]

      assert :ok = DocServer.apply_block_operations(doc.id, operations)

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      assert length(blocks) == 1

      [block] = blocks
      assert block.type == "paragraph"
      assert block.content == "Hello world"
      assert block.props["backgroundColor"] == "default"
      assert block.props["textAlignment"] == "left"
    end

    test "append_block creates heading with level prop", %{document: doc} do
      operations = [
        %{
          "type" => "append_block",
          "block" => %{
            "type" => "heading",
            "content" => "Section Title",
            "props" => %{"level" => 2}
          }
        }
      ]

      assert :ok = DocServer.apply_block_operations(doc.id, operations)

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      [block] = blocks

      assert block.type == "heading"
      assert block.content == "Section Title"
      assert block.props["level"] == 2
    end

    test "append_block creates checkListItem with checked prop", %{document: doc} do
      operations = [
        %{
          "type" => "append_block",
          "block" => %{
            "type" => "checkListItem",
            "content" => "Completed task",
            "props" => %{"checked" => true}
          }
        }
      ]

      assert :ok = DocServer.apply_block_operations(doc.id, operations)

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      [block] = blocks

      assert block.type == "checkListItem"
      assert block.content == "Completed task"
      assert block.props["checked"] == true
    end

    test "append_block creates codeBlock with language prop", %{document: doc} do
      operations = [
        %{
          "type" => "append_block",
          "block" => %{
            "type" => "codeBlock",
            "content" => "print('hello')",
            "props" => %{"language" => "python"}
          }
        }
      ]

      assert :ok = DocServer.apply_block_operations(doc.id, operations)

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      [block] = blocks

      assert block.type == "codeBlock"
      assert block.content == "print('hello')"
      assert block.props["language"] == "python"
    end

    test "heading defaults to level 1 when no props provided", %{document: doc} do
      operations = [
        %{
          "type" => "append_block",
          "block" => %{"type" => "heading", "content" => "Default Heading"}
        }
      ]

      assert :ok = DocServer.apply_block_operations(doc.id, operations)

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      [block] = blocks

      assert block.props["level"] == 1
    end

    test "insert_block passes props correctly", %{document: doc} do
      # First create a block
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{"type" => "append_block", "block" => %{"type" => "paragraph", "content" => "First"}}
        ])

      {:ok, [first_block]} = DocServer.get_blocks(doc.id)

      # Insert a heading after it
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "insert_block",
            "after_id" => first_block.id,
            "block" => %{
              "type" => "heading",
              "content" => "New Heading",
              "props" => %{"level" => 3}
            }
          }
        ])

      {:ok, blocks} = DocServer.get_blocks(doc.id)
      assert length(blocks) == 2

      [_first, heading] = blocks
      assert heading.type == "heading"
      assert heading.props["level"] == 3
    end

    test "update_block can update props without changing content", %{document: doc} do
      # Create a heading
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{
              "type" => "heading",
              "content" => "My Heading",
              "props" => %{"level" => 1}
            }
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)

      # Update only the level prop
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "update_block",
            "block_id" => block.id,
            "props" => %{"level" => 2}
          }
        ])

      {:ok, [updated_block]} = DocServer.get_blocks(doc.id)

      assert updated_block.content == "My Heading"
      assert updated_block.props["level"] == 2
    end

    test "update_block merges new props with existing", %{document: doc} do
      # Create a block with multiple props
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{
              "type" => "heading",
              "content" => "Styled Heading",
              "props" => %{"level" => 1, "textAlignment" => "center"}
            }
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)

      # Update level but keep alignment
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "update_block",
            "block_id" => block.id,
            "props" => %{"level" => 3}
          }
        ])

      {:ok, [updated_block]} = DocServer.get_blocks(doc.id)

      assert updated_block.props["level"] == 3
      assert updated_block.props["textAlignment"] == "center"
    end
  end

  describe "convert_block operation" do
    test "converts paragraph to heading with level", %{document: doc} do
      # Create a paragraph
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{"type" => "paragraph", "content" => "Some text"}
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)
      assert block.type == "paragraph"

      # Convert to heading
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => block.id,
            "to_type" => "heading",
            "props" => %{"level" => 2}
          }
        ])

      {:ok, [converted_block]} = DocServer.get_blocks(doc.id)

      assert converted_block.type == "heading"
      assert converted_block.content == "Some text"
      assert converted_block.props["level"] == 2
    end

    test "converts heading to paragraph", %{document: doc} do
      # Create a heading
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{
              "type" => "heading",
              "content" => "A Heading",
              "props" => %{"level" => 1}
            }
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)

      # Convert to paragraph
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => block.id,
            "to_type" => "paragraph"
          }
        ])

      {:ok, [converted_block]} = DocServer.get_blocks(doc.id)

      assert converted_block.type == "paragraph"
      assert converted_block.content == "A Heading"
      # Should not have level prop for paragraph (or it's ignored)
    end

    test "preserves content during conversion", %{document: doc} do
      content = "This is some important content that should be preserved"

      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{"type" => "paragraph", "content" => content}
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)

      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => block.id,
            "to_type" => "bulletListItem"
          }
        ])

      {:ok, [converted_block]} = DocServer.get_blocks(doc.id)

      assert converted_block.type == "bulletListItem"
      assert converted_block.content == content
    end

    test "returns error for non-existent block_id", %{document: doc} do
      # First create a block so the blockGroup exists
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{"type" => "paragraph", "content" => "Existing block"}
          }
        ])

      result =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => "nonexistent-id",
            "to_type" => "heading"
          }
        ])

      assert {:error, "Block not found: nonexistent-id"} = result
    end

    test "converts paragraph to checkListItem with checked prop", %{document: doc} do
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{"type" => "paragraph", "content" => "Task to do"}
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)

      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => block.id,
            "to_type" => "checkListItem",
            "props" => %{"checked" => true}
          }
        ])

      {:ok, [converted_block]} = DocServer.get_blocks(doc.id)

      assert converted_block.type == "checkListItem"
      assert converted_block.props["checked"] == true
    end

    test "converts bulletListItem to checkListItem preserving formatted content", %{document: doc} do
      # Create a bullet with bold markdown content
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "append_block",
            "block" => %{
              "type" => "bulletListItem",
              "content" => "Text with **bold** formatting"
            }
          }
        ])

      {:ok, [block]} = DocServer.get_blocks(doc.id)
      assert block.content =~ "bold"

      # Convert to checkbox
      :ok =
        DocServer.apply_block_operations(doc.id, [
          %{
            "type" => "convert_block",
            "block_id" => block.id,
            "to_type" => "checkListItem",
            "props" => %{"checked" => true}
          }
        ])

      {:ok, [converted_block]} = DocServer.get_blocks(doc.id)

      assert converted_block.type == "checkListItem"
      # Content should be preserved (bold formatting becomes plain text after conversion)
      assert converted_block.content =~ "bold"
    end
  end
end
