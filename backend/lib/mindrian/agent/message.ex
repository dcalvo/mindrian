defmodule Mindrian.Agent.Message do
  @moduledoc """
  Internal message representation for agent conversations.

  This module decouples the internal message format from the Anthropic API format,
  allowing easier provider switching and cleaner internal code.
  """

  @type role :: :user | :assistant
  @type content_block :: text_block() | tool_use_block() | tool_result_block()
  @type text_block :: %{type: :text, text: String.t()}
  @type tool_use_block :: %{type: :tool_use, id: String.t(), name: String.t(), input: map()}
  @type tool_result_block :: %{
          type: :tool_result,
          tool_use_id: String.t(),
          content: String.t(),
          is_error: boolean()
        }

  @type t :: %__MODULE__{
          role: role(),
          content: String.t() | [content_block()]
        }

  @enforce_keys [:role, :content]
  defstruct [:role, :content]

  @doc """
  Creates a user message with text content.
  """
  def user(content) when is_binary(content) do
    %__MODULE__{role: :user, content: content}
  end

  @doc """
  Creates an assistant message with text content.
  """
  def assistant(content) when is_binary(content) do
    %__MODULE__{role: :assistant, content: content}
  end

  @doc """
  Creates an assistant message with tool use requests.
  """
  def assistant_with_tools(text_content, tool_uses) when is_list(tool_uses) do
    content_blocks =
      if text_content != "" do
        [%{type: :text, text: text_content}]
      else
        []
      end

    tool_blocks =
      Enum.map(tool_uses, fn tool ->
        %{type: :tool_use, id: tool.id, name: tool.name, input: tool.input}
      end)

    %__MODULE__{role: :assistant, content: content_blocks ++ tool_blocks}
  end

  @doc """
  Creates a user message containing tool results.
  """
  def tool_results(results) when is_list(results) do
    content_blocks =
      Enum.map(results, fn result ->
        %{
          type: :tool_result,
          tool_use_id: result.tool_use_id,
          content: result.content,
          is_error: result[:is_error] || false
        }
      end)

    %__MODULE__{role: :user, content: content_blocks}
  end

  @doc """
  Creates a tool result for a rejected tool request.
  """
  def tool_rejected(tool_use_id) do
    tool_results([
      %{
        tool_use_id: tool_use_id,
        content: "The user rejected this tool request.",
        is_error: true
      }
    ])
  end

  @doc """
  Creates a tool result for a successful tool execution.
  """
  def tool_success(tool_use_id, data) do
    tool_results([
      %{
        tool_use_id: tool_use_id,
        content: Jason.encode!(data),
        is_error: false
      }
    ])
  end

  @doc """
  Creates a tool result for a failed tool execution.
  """
  def tool_error(tool_use_id, error) do
    tool_results([
      %{
        tool_use_id: tool_use_id,
        content: "Error: #{error}",
        is_error: true
      }
    ])
  end

  @doc """
  Converts internal message format to Anthropic API format.
  """
  def to_anthropic(%__MODULE__{role: role, content: content}) when is_binary(content) do
    %{role: to_string(role), content: content}
  end

  def to_anthropic(%__MODULE__{role: role, content: content_blocks})
      when is_list(content_blocks) do
    api_content =
      Enum.map(content_blocks, fn
        %{type: :text, text: text} ->
          %{"type" => "text", "text" => text}

        %{type: :tool_use, id: id, name: name, input: input} ->
          %{"type" => "tool_use", "id" => id, "name" => name, "input" => input}

        %{type: :tool_result, tool_use_id: id, content: content, is_error: is_error} ->
          base = %{"type" => "tool_result", "tool_use_id" => id, "content" => content}
          if is_error, do: Map.put(base, "is_error", true), else: base
      end)

    %{role: to_string(role), content: api_content}
  end

  @doc """
  Converts a list of internal messages to Anthropic API format.
  """
  def to_anthropic_messages(messages) when is_list(messages) do
    Enum.map(messages, &to_anthropic/1)
  end
end
