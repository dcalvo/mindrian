defmodule Mindrian.Agent.Anthropic do
  @moduledoc """
  HTTP client for the Anthropic Claude API using Req.

  Supports both synchronous and streaming responses.
  """
  require Logger
  alias Mindrian.Agent.Debug

  @api_url "https://api.anthropic.com/v1/messages"
  @model "claude-haiku-4-5"
  @max_tokens 4096
  @api_version "2023-06-01"

  # Streaming state for tracking content blocks
  defmodule StreamState do
    @moduledoc false
    defstruct [
      :callback,
      :buffer,
      text_started: false,
      current_block: nil,
      tool_json: "",
      tool_use: []
    ]
  end

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
  Streams a message to Claude, calling the callback function for each event.

  ## Parameters
    - messages: List of message maps with :role and :content keys
    - callback: Function called for each stream event:
      - `:stream_start` - Text content block started
      - `{:stream_delta, text}` - Text chunk received
      - `{:stream_end, tool_use}` - Stream complete, with any tool_use blocks
      - `{:stream_error, reason}` - Error during streaming
    - opts: Same as chat/2 (tools, system)

  ## Returns
    - :ok on success (results delivered via callback)
    - {:error, reason} on failure
  """
  def stream_chat(messages, callback, opts \\ []) do
    tools = Keyword.get(opts, :tools, [])
    system = Keyword.get(opts, :system)

    body =
      %{
        model: @model,
        max_tokens: @max_tokens,
        messages: messages,
        stream: true
      }
      |> maybe_add_tools(tools)
      |> maybe_add_system(system)

    headers = [
      {"x-api-key", api_key()},
      {"anthropic-version", @api_version},
      {"content-type", "application/json"}
    ]

    initial_state = %StreamState{callback: callback, buffer: ""}

    # Use Req's streaming with into: fun to process chunks
    into_fun = fn {:data, chunk}, {req, resp} ->
      # Process the chunk through our SSE parser
      # The state is stored in the process dictionary for simplicity
      state = Process.get(:stream_state, initial_state)
      state = process_sse_chunk(chunk, state)
      Process.put(:stream_state, state)
      {:cont, {req, resp}}
    end

    Process.put(:stream_state, initial_state)

    case Req.post(@api_url,
           json: body,
           headers: headers,
           into: into_fun,
           receive_timeout: 120_000
         ) do
      {:ok, %Req.Response{status: 200}} ->
        # Get final state and emit stream_end
        state = Process.get(:stream_state)
        Process.delete(:stream_state)
        callback.({:stream_end, state.tool_use})
        :ok

      {:ok, %Req.Response{status: status, body: body}} ->
        Process.delete(:stream_state)
        Logger.error("Anthropic streaming API error: status=#{status} body=#{inspect(body)}")
        callback.({:stream_error, {:api_error, status, body}})
        {:error, {:api_error, status, body}}

      {:error, reason} ->
        Process.delete(:stream_state)
        Logger.error("Anthropic streaming request failed: #{inspect(reason)}")
        callback.({:stream_error, {:request_failed, reason}})
        {:error, {:request_failed, reason}}
    end
  end

  # Process a chunk of SSE data
  defp process_sse_chunk(chunk, state) do
    Debug.sse_chunk(byte_size(chunk))

    # Append to buffer and process complete lines
    buffer = state.buffer <> chunk
    {events, remaining} = parse_sse_buffer(buffer)

    state = %{state | buffer: remaining}
    Enum.reduce(events, state, &process_sse_event/2)
  end

  # Parse SSE buffer into events, returning {events, remaining_buffer}
  defp parse_sse_buffer(buffer) do
    # SSE events are separated by double newlines
    # Each event has "event: type\ndata: json\n"
    lines = String.split(buffer, "\n")

    {events, remaining_lines, current_event} =
      Enum.reduce(lines, {[], [], %{}}, fn line, {events, remaining, current} ->
        cond do
          String.starts_with?(line, "event: ") ->
            event_type = String.trim_leading(line, "event: ")
            {events, remaining, Map.put(current, :event, event_type)}

          String.starts_with?(line, "data: ") ->
            data = String.trim_leading(line, "data: ")
            {events, remaining, Map.put(current, :data, data)}

          line == "" and map_size(current) > 0 ->
            # End of event
            {events ++ [current], remaining, %{}}

          line == "" ->
            {events, remaining, current}

          true ->
            # Incomplete line, save for next chunk
            {events, remaining ++ [line], current}
        end
      end)

    # Reconstruct remaining buffer
    remaining =
      case {remaining_lines, current_event} do
        {[], %{}} ->
          ""

        {lines, %{}} ->
          Enum.join(lines, "\n")

        {[], event} ->
          reconstruct_event(event)

        {lines, event} ->
          Enum.join(lines, "\n") <> "\n" <> reconstruct_event(event)
      end

    {events, remaining}
  end

  defp reconstruct_event(%{event: type, data: data}), do: "event: #{type}\ndata: #{data}"
  defp reconstruct_event(%{event: type}), do: "event: #{type}"
  defp reconstruct_event(%{data: data}), do: "data: #{data}"
  defp reconstruct_event(%{}), do: ""

  # Process a single SSE event
  defp process_sse_event(%{event: "content_block_start", data: data}, state) do
    Debug.sse_event("content_block_start")

    case Jason.decode(data) do
      {:ok, %{"content_block" => %{"type" => "text"}}} ->
        Debug.sse_event("content_block_start:text", %{text_started: state.text_started})

        # Text block started - emit stream_start only once
        if not state.text_started do
          state.callback.(:stream_start)
          %{state | text_started: true, current_block: :text}
        else
          %{state | current_block: :text}
        end

      {:ok, %{"content_block" => %{"type" => "tool_use", "id" => id, "name" => name}}} ->
        Debug.sse_event("content_block_start:tool_use", %{tool_name: name})
        # Tool use block started
        %{state | current_block: {:tool_use, id, name}, tool_json: ""}

      {:ok, other} ->
        Debug.sse_event("content_block_start:unknown", %{content_block: inspect(other)})
        state

      {:error, error} ->
        Debug.sse_parse_error({:content_block_start, error})
        state
    end
  end

  defp process_sse_event(%{event: "content_block_delta", data: data}, state) do
    case Jason.decode(data) do
      {:ok, %{"delta" => %{"type" => "text_delta", "text" => text}}} ->
        Debug.sse_event("content_block_delta:text", %{text_length: String.length(text)})
        state.callback.({:stream_delta, text})
        state

      {:ok, %{"delta" => %{"type" => "input_json_delta", "partial_json" => json}}} ->
        Debug.sse_event("content_block_delta:json", %{json_length: String.length(json)})
        # Accumulate tool input JSON
        %{state | tool_json: state.tool_json <> json}

      {:ok, other} ->
        Debug.sse_event("content_block_delta:unknown", %{delta: inspect(other)})
        state

      {:error, error} ->
        Debug.sse_parse_error({:content_block_delta, error})
        state
    end
  end

  defp process_sse_event(%{event: "content_block_stop"}, state) do
    Debug.sse_event("content_block_stop", %{current_block: inspect(state.current_block)})

    case state.current_block do
      {:tool_use, id, name} ->
        # Tool block complete, parse accumulated JSON
        input =
          case Jason.decode(state.tool_json) do
            {:ok, parsed} -> parsed
            {:error, _} -> %{}
          end

        tool = %{id: id, name: name, input: input}
        %{state | tool_use: state.tool_use ++ [tool], current_block: nil, tool_json: ""}

      _ ->
        %{state | current_block: nil}
    end
  end

  defp process_sse_event(%{event: "message_stop"}, state) do
    Debug.sse_event("message_stop")
    # Message complete - stream_end will be emitted by the caller
    state
  end

  defp process_sse_event(%{event: "ping"}, state) do
    Debug.sse_event("ping")
    state
  end

  defp process_sse_event(%{event: "message_start"}, state) do
    Debug.sse_event("message_start")
    state
  end

  defp process_sse_event(%{event: "message_delta"}, state) do
    Debug.sse_event("message_delta")
    state
  end

  defp process_sse_event(event, state) do
    Debug.sse_event("unknown", %{event: inspect(event)})
    state
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
