defmodule Mindrian.Release.DemoContent do
  @moduledoc """
  Helper for seeding demo YJS document content.
  Creates BlockNote-compatible YJS structures from markdown.
  """

  alias Mindrian.Repo
  alias Mindrian.Collaboration.YjsDocument

  # MDEx options for markdown parsing
  @mdex_options [
    extension: [
      strikethrough: true,
      table: true,
      autolink: true,
      tasklist: true
    ]
  ]

  @doc """
  Seeds YJS content for a document from markdown text.
  Returns :ok on success.
  """
  def seed_yjs_content(doc_id, markdown_content) do
    # Create a new YJS doc
    ydoc = Yex.Doc.new()

    # Get the document-store fragment (must be outside transaction!)
    fragment = Yex.Doc.get_xml_fragment(ydoc, "document-store")

    # Parse markdown and build YJS structure
    blocks = parse_markdown_to_blocks(markdown_content)

    # Build the BlockNote structure inside a transaction
    Yex.Doc.transaction(ydoc, fn ->
      # Create blockGroup with all block containers
      block_containers = Enum.map(blocks, &build_block_container/1)

      block_group =
        Yex.XmlElementPrelim.new(
          "blockGroup",
          block_containers,
          %{}
        )

      # Push to fragment
      Yex.XmlFragment.push(fragment, block_group)
    end)

    # Encode the state as an update
    update = Yex.encode_state_as_update!(ydoc)

    # Store in database
    Repo.insert!(%YjsDocument{
      doc_name: doc_id,
      value: update,
      version: "v1"
    })

    :ok
  end

  # Parse markdown into a list of block definitions
  defp parse_markdown_to_blocks(markdown) do
    markdown
    |> String.split(~r/\n{2,}/, trim: true)
    |> Enum.flat_map(&parse_block/1)
  end

  # Parse a single markdown block into a list of block definitions
  defp parse_block(text) do
    text = String.trim(text)

    cond do
      # Image: ![alt](url)
      Regex.match?(~r/^!\[.*\]\(.*\)$/, text) ->
        parse_image(text)

      # Heading 1
      String.starts_with?(text, "# ") ->
        [%{type: "heading", content: String.trim_leading(text, "# "), props: %{"level" => "1"}}]

      # Heading 2
      String.starts_with?(text, "## ") ->
        [%{type: "heading", content: String.trim_leading(text, "## "), props: %{"level" => "2"}}]

      # Heading 3 - may have content on following lines
      String.starts_with?(text, "### ") ->
        parse_heading_with_content(text, "### ", "3")

      # Numbered list (1. 2. 3. etc)
      Regex.match?(~r/^\d+\. /, text) ->
        parse_numbered_list(text)

      # Bullet list (handle multi-line)
      String.starts_with?(text, "* ") or String.starts_with?(text, "- ") ->
        parse_list_items(text)

      # Blockquote
      String.starts_with?(text, "> ") ->
        content =
          text
          |> String.split("\n")
          |> Enum.map(&String.trim_leading(&1, "> "))
          |> Enum.join("\n")

        [%{type: "paragraph", content: content, props: %{}}]

      # Checkbox items
      String.starts_with?(text, "* [ ]") or String.starts_with?(text, "* [x]") ->
        parse_checkbox_items(text)

      # Check if block contains embedded list items (text followed by list)
      String.contains?(text, "\n- ") or String.contains?(text, "\n* ") ->
        parse_mixed_block(text)

      # Check if block contains embedded numbered list
      Regex.match?(~r/\n\d+\. /, text) ->
        parse_mixed_numbered_block(text)

      # Default to paragraph
      true ->
        [%{type: "paragraph", content: text, props: %{}}]
    end
  end

  # Parse image: ![alt](url)
  defp parse_image(text) do
    case Regex.run(~r/^!\[(.*)\]\((.*)\)$/, text) do
      [_, alt, url] ->
        [%{type: "image", content: "", props: %{"url" => url, "caption" => alt, "name" => alt}}]

      _ ->
        [%{type: "paragraph", content: text, props: %{}}]
    end
  end

  # Parse heading that may have content on following lines
  defp parse_heading_with_content(text, prefix, level) do
    case String.split(text, "\n", parts: 2) do
      [heading_line] ->
        [
          %{
            type: "heading",
            content: String.trim_leading(heading_line, prefix),
            props: %{"level" => level}
          }
        ]

      [heading_line, rest] ->
        heading = %{
          type: "heading",
          content: String.trim_leading(heading_line, prefix),
          props: %{"level" => level}
        }

        rest_blocks = parse_block(String.trim(rest))
        [heading | rest_blocks]
    end
  end

  # Parse numbered list items
  defp parse_numbered_list(text) do
    text
    |> String.split("\n")
    |> Enum.filter(&Regex.match?(~r/^\d+\. /, String.trim(&1)))
    |> Enum.map(fn line ->
      content = Regex.replace(~r/^\d+\. /, String.trim(line), "")
      %{type: "numberedListItem", content: content, props: %{}}
    end)
  end

  # Parse block with intro text followed by numbered list
  defp parse_mixed_numbered_block(text) do
    lines = String.split(text, "\n")

    {intro_lines, list_lines} =
      Enum.split_while(lines, fn line ->
        not Regex.match?(~r/^\d+\. /, String.trim(line))
      end)

    intro_blocks =
      case Enum.join(intro_lines, "\n") |> String.trim() do
        "" -> []
        intro -> [%{type: "paragraph", content: intro, props: %{}}]
      end

    list_blocks = parse_numbered_list(Enum.join(list_lines, "\n"))

    intro_blocks ++ list_blocks
  end

  # Parse a block that has intro text followed by list items
  defp parse_mixed_block(text) do
    lines = String.split(text, "\n")

    {intro_lines, list_lines} =
      Enum.split_while(lines, fn line ->
        not (String.starts_with?(line, "- ") or String.starts_with?(line, "* "))
      end)

    intro_blocks =
      case Enum.join(intro_lines, "\n") |> String.trim() do
        "" -> []
        intro -> [%{type: "paragraph", content: intro, props: %{}}]
      end

    list_blocks = parse_list_items(Enum.join(list_lines, "\n"))

    intro_blocks ++ list_blocks
  end

  # Parse bullet list items - returns list of block definitions
  defp parse_list_items(text) do
    text
    |> String.split("\n")
    |> Enum.filter(fn line ->
      trimmed = String.trim(line)
      String.starts_with?(trimmed, "* ") or String.starts_with?(trimmed, "- ")
    end)
    |> Enum.map(fn line ->
      content =
        line
        |> String.trim()
        |> String.trim_leading("* ")
        |> String.trim_leading("- ")

      %{type: "bulletListItem", content: content, props: %{}}
    end)
  end

  # Parse checkbox items - returns list of block definitions
  defp parse_checkbox_items(text) do
    text
    |> String.split("\n")
    |> Enum.filter(&String.starts_with?(String.trim(&1), "* ["))
    |> Enum.map(fn line ->
      checked = String.contains?(line, "[x]")
      content = line |> String.trim() |> String.replace(~r/^\* \[[x ]\] /, "")
      %{type: "checkListItem", content: content, props: %{"checked" => to_string(checked)}}
    end)
  end

  # Build a block container from a block definition
  defp build_block_container(%{type: "image", content: _content, props: props}) do
    block_id = generate_block_id()

    # Image blocks don't have text content, just props
    inner_block =
      Yex.XmlElementPrelim.new(
        "image",
        [],
        props
      )

    # Wrap in blockContainer
    Yex.XmlElementPrelim.new(
      "blockContainer",
      [inner_block],
      %{"id" => block_id}
    )
  end

  defp build_block_container(%{type: type, content: content, props: props}) do
    block_id = generate_block_id()

    # Parse markdown formatting in content
    text_prelim = parse_inline_markdown(content)

    # Create the inner block
    inner_block =
      Yex.XmlElementPrelim.new(
        type,
        [text_prelim],
        props
      )

    # Wrap in blockContainer
    Yex.XmlElementPrelim.new(
      "blockContainer",
      [inner_block],
      %{"id" => block_id}
    )
  end

  # Parse inline markdown (bold, italic, etc.) to YJS delta format
  defp parse_inline_markdown(content) when is_binary(content) do
    case MDEx.to_delta(content, @mdex_options) do
      {:ok, delta} ->
        yex_delta = convert_mdex_delta(delta)

        case yex_delta do
          [] -> Yex.XmlTextPrelim.from("")
          _ -> Yex.XmlTextPrelim.from(yex_delta)
        end

      {:error, _} ->
        Yex.XmlTextPrelim.from(content)
    end
  end

  # Convert MDEx delta to Yex delta format
  defp convert_mdex_delta(mdex_delta) do
    mdex_delta
    |> Enum.reject(&block_level_newline?/1)
    |> Enum.map(&convert_delta_entry/1)
  end

  defp block_level_newline?(%{"insert" => "\n", "attributes" => attrs}) do
    Map.has_key?(attrs, "header") or
      Map.has_key?(attrs, "blockquote") or
      Map.has_key?(attrs, "code-block") or
      Map.has_key?(attrs, "list")
  end

  defp block_level_newline?(%{"insert" => "\n"}), do: true
  defp block_level_newline?(_), do: false

  defp convert_delta_entry(%{"insert" => text, "attributes" => attrs}) do
    %{insert: text, attributes: attrs}
  end

  defp convert_delta_entry(%{"insert" => text}) do
    %{insert: text}
  end

  # Generate a unique block ID (matches BlockNote format)
  defp generate_block_id do
    :crypto.strong_rand_bytes(16)
    |> Base.encode16(case: :lower)
    |> binary_part(0, 8)
    |> then(&("block-" <> &1))
  end
end
