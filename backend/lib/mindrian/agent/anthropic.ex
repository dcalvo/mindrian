defmodule Mindrian.Agent.Anthropic do
  @moduledoc """
  HTTP client for the Anthropic Claude API using Req.
  """
  require Logger

  @api_url "https://api.anthropic.com/v1/messages"
  @model "claude-sonnet-4-20250514"
  @max_tokens 4096
  @api_version "2023-06-01"

  @doc """
  Sends a message to Claude and returns the response.

  ## Parameters
    - messages: List of message maps with :role and :content keys
    - tools: Optional list of tool definitions
    - system: Optional system prompt

  ## Returns
    - {:ok, response} on success where response contains :content and optionally :tool_use
    - {:error, reason} on failure
  """
  def chat(messages, opts \\ []) do
    tools = Keyword.get(opts, :tools, [])
    system = Keyword.get(opts, :system)

    body =
      %{
        model: @model,
        max_tokens: @max_tokens,
        messages: messages
      }
      |> maybe_add_tools(tools)
      |> maybe_add_system(system)

    headers = [
      {"x-api-key", api_key()},
      {"anthropic-version", @api_version},
      {"content-type", "application/json"}
    ]

    case Req.post(@api_url, json: body, headers: headers, receive_timeout: 120_000) do
      {:ok, %Req.Response{status: 200, body: body}} ->
        parse_response(body)

      {:ok, %Req.Response{status: status, body: body}} ->
        Logger.error("Anthropic API error: status=#{status} body=#{inspect(body)}")
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Logger.error("Anthropic API request failed: #{inspect(reason)}")
        {:error, {:request_failed, reason}}
    end
  end

  @doc """
  Sends tool results back to Claude to continue the conversation.
  """
  def continue_with_tool_results(messages, tool_results, opts \\ []) do
    # Build the tool result content blocks
    tool_result_content =
      Enum.map(tool_results, fn result ->
        %{
          type: "tool_result",
          tool_use_id: result.tool_use_id,
          content: result.content
        }
        |> maybe_add_error(result[:is_error])
      end)

    # Add the tool results as a user message
    messages_with_results = messages ++ [%{role: "user", content: tool_result_content}]

    chat(messages_with_results, opts)
  end

  defp parse_response(%{"content" => content, "stop_reason" => stop_reason} = body) do
    # Extract text content and tool use blocks
    text_content =
      content
      |> Enum.filter(&(&1["type"] == "text"))
      |> Enum.map(& &1["text"])
      |> Enum.join("\n")

    tool_use =
      content
      |> Enum.filter(&(&1["type"] == "tool_use"))
      |> Enum.map(fn tool ->
        %{
          id: tool["id"],
          name: tool["name"],
          input: tool["input"]
        }
      end)

    response = %{
      content: text_content,
      tool_use: tool_use,
      stop_reason: stop_reason,
      usage: body["usage"]
    }

    {:ok, response}
  end

  defp parse_response(body) do
    Logger.error("Unexpected Anthropic API response format: #{inspect(body)}")
    {:error, {:unexpected_response, body}}
  end

  defp maybe_add_tools(body, []), do: body
  defp maybe_add_tools(body, tools), do: Map.put(body, :tools, tools)

  defp maybe_add_system(body, nil), do: body
  defp maybe_add_system(body, system), do: Map.put(body, :system, system)

  defp maybe_add_error(result, true), do: Map.put(result, :is_error, true)
  defp maybe_add_error(result, _), do: result

  defp api_key do
    Application.get_env(:mindrian, :anthropic_api_key) ||
      raise "ANTHROPIC_API_KEY not configured"
  end
end
