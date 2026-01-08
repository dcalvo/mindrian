defmodule Mindrian.Chat.Drivers.AgnoDriver do
  @moduledoc """
  Driver connecting ConversationServer to the Agno AI agent service.

  Implements the `Mindrian.Chat.Driver` behaviour. Uses SSE streaming to
  receive events from Agno and translates them to the standard Driver
  event format. See `Mindrian.Chat.Driver` for the complete event specification.

  ## Configuration

      config :mindrian, :agno_url, "http://localhost:8000"
  """

  @behaviour Mindrian.Chat.Driver

  require Logger

  alias Mindrian.Chat.{Conversation, SSEParser}

  @agent_id "mindrian-agent"
  @timeout 120_000

  # ---------------------------------------------------------------------------
  # Driver Callbacks
  # ---------------------------------------------------------------------------

  @impl true
  def run(%Conversation{} = conv) do
    url = "#{agno_url()}/agents/#{@agent_id}/runs"

    # Get the last user message
    user_message =
      conv.messages
      |> Enum.reverse()
      |> Enum.find(&(&1.role == :user))

    if user_message == nil do
      {:error, "No user message to send"}
    else
      Logger.info("AgnoDriver: starting run for session=#{conv.id}")

      form_data = [
        {"message", user_message.content},
        {"stream", "true"},
        {"session_id", conv.id},
        {"user_id", conv.scope.user.id},
        {"dependencies", Jason.encode!(%{document_id: nil, workspace_id: conv.workspace_id})}
      ]

      {:ok, build_event_stream(url, form_data)}
    end
  end

  @impl true
  def continue(run_id, conversation_id, scope, tools) do
    url = "#{agno_url()}/agents/#{@agent_id}/runs/#{run_id}/continue"

    # Build tool execution list
    tool_executions =
      Enum.map(tools, fn tool ->
        base = %{
          tool_call_id: tool.tool_call_id,
          tool_name: tool.tool_name,
          tool_args: tool.tool_args || %{},
          requires_confirmation: true,
          confirmed: tool.confirmed
        }

        if tool.confirmed do
          base
        else
          Map.put(base, :confirmation_note, "User rejected the tool execution")
        end
      end)

    tool_names = Enum.map(tools, & &1.tool_name) |> Enum.join(", ")
    Logger.info("AgnoDriver: continuing run=#{run_id} with tools=[#{tool_names}]")

    form_data = [
      {"tools", Jason.encode!(tool_executions)},
      {"stream", "true"},
      {"session_id", conversation_id},
      {"user_id", scope.user.id}
    ]

    {:ok, build_event_stream(url, form_data)}
  end

  @impl true
  def cancel(run_id) do
    Logger.info("AgnoDriver: cancelling run=#{run_id}")
    url = "#{agno_url()}/agents/#{@agent_id}/runs/#{run_id}/cancel"

    case Req.post(url, receive_timeout: @timeout) do
      {:ok, %{status: 200}} ->
        Logger.info("AgnoDriver: cancelled run=#{run_id}")
        :ok

      # Agno returns 500 for already-completed runs - treat as success
      {:ok, %{status: 500}} ->
        Logger.info("AgnoDriver: run=#{run_id} already completed")
        :ok

      {:ok, %{status: status, body: body}} ->
        {:error, "Cancel failed: #{status} - #{inspect(body)}"}

      {:error, reason} ->
        {:error, reason}
    end
  end

  # ---------------------------------------------------------------------------
  # Stream Building
  # ---------------------------------------------------------------------------

  defp build_event_stream(url, form_data) do
    Stream.resource(
      fn -> start_sse_consumer(url, form_data) end,
      &receive_events/1,
      &cleanup_consumer/1
    )
  end

  defp start_sse_consumer(url, form_data) do
    parent = self()

    # Spawn a process that makes the SSE request and sends events to parent
    pid =
      spawn_link(fn ->
        case Req.post(url,
               form: form_data,
               headers: [{"accept", "text/event-stream"}],
               receive_timeout: @timeout,
               into: :self
             ) do
          {:ok, resp} ->
            consume_sse_response(resp, parent, "")

          {:error, reason} ->
            send(parent, {:sse_error, reason})
        end
      end)

    %{pid: pid, done: false}
  end

  defp consume_sse_response(resp, parent, buffer) do
    receive do
      message ->
        case Req.parse_message(resp, message) do
          {:ok, chunks} ->
            buffer = process_chunks(chunks, parent, buffer)
            consume_sse_response(resp, parent, buffer)

          {:error, reason} ->
            send(parent, {:sse_error, reason})

          :unknown ->
            consume_sse_response(resp, parent, buffer)
        end
    after
      @timeout ->
        send(parent, {:sse_error, :timeout})
    end
  end

  defp process_chunks(chunks, parent, buffer) do
    Enum.reduce(chunks, buffer, fn chunk, buf ->
      case chunk do
        {:data, data} ->
          {events, new_buffer} = SSEParser.parse(data, buf)

          for event <- events do
            driver_event = translate_event(event)
            if driver_event, do: send(parent, {:sse_event, driver_event})
          end

          new_buffer

        :done ->
          send(parent, :sse_done)
          ""

        {:trailers, _} ->
          buf
      end
    end)
  end

  defp receive_events(%{done: true} = state) do
    {:halt, state}
  end

  defp receive_events(state) do
    receive do
      {:sse_event, event} ->
        {[event], state}

      {:sse_error, reason} ->
        {[{:error, inspect(reason)}], %{state | done: true}}

      :sse_done ->
        {:halt, %{state | done: true}}
    after
      @timeout ->
        {[{:error, "SSE stream timeout"}], %{state | done: true}}
    end
  end

  defp cleanup_consumer(%{pid: pid}) do
    if Process.alive?(pid) do
      Process.unlink(pid)
      Process.exit(pid, :kill)
    end
  end

  # ---------------------------------------------------------------------------
  # Event Translation (Agno -> Driver)
  # ---------------------------------------------------------------------------

  defp translate_event(%{"event" => "RunStarted", "run_id" => run_id}) do
    Logger.info("AgnoDriver: run started run_id=#{run_id}")
    {:run_started, run_id}
  end

  defp translate_event(%{"event" => "RunContent", "content" => content})
       when is_binary(content) and content != "" do
    {:text_chunk, content}
  end

  defp translate_event(%{"event" => "RunContent"}) do
    # Empty content chunk (often sent with citations) - ignore
    nil
  end

  defp translate_event(%{"event" => "RunContentCompleted"}) do
    Logger.debug("AgnoDriver: text content completed")
    :text_end
  end

  defp translate_event(%{"event" => "ToolCallStarted", "tool" => tool}) do
    Logger.info("AgnoDriver: tool started name=#{tool["tool_name"]} id=#{tool["tool_call_id"]}")
    {:tool_started, tool["tool_call_id"], tool["tool_name"], tool["tool_args"] || %{}}
  end

  defp translate_event(%{"event" => "ToolCallCompleted", "tool" => tool}) do
    id = tool["tool_call_id"]

    if tool["tool_call_error"] do
      Logger.warning("AgnoDriver: tool failed id=#{id}")
      {:tool_failed, id, tool["result"] || "Tool execution failed"}
    else
      Logger.info("AgnoDriver: tool completed id=#{id}")
      result = parse_python_dict(tool["result"])
      {:tool_completed, id, result}
    end
  end

  defp translate_event(%{"event" => "RunPaused", "run_id" => run_id, "tools" => tools}) do
    tool_names = Enum.map(tools, & &1["tool_name"]) |> Enum.join(", ")
    Logger.info("AgnoDriver: run paused for approval run_id=#{run_id} tools=[#{tool_names}]")

    tool_infos =
      Enum.map(tools, fn tool ->
        %{
          id: tool["tool_call_id"],
          name: tool["tool_name"],
          args: tool["tool_args"] || %{},
          description: "Execute #{tool["tool_name"]}"
        }
      end)

    {:paused, run_id, tool_infos}
  end

  defp translate_event(%{"event" => "RunContinued"}) do
    Logger.info("AgnoDriver: run continued")
    :continued
  end

  defp translate_event(%{"event" => "RunCompleted"}) do
    Logger.info("AgnoDriver: run completed")
    :complete
  end

  defp translate_event(%{"event" => "RunError", "content" => content}) do
    Logger.error("AgnoDriver: run error: #{content}")
    {:error, content}
  end

  defp translate_event(%{"event" => event_type}) do
    Logger.debug("AgnoDriver: ignoring event type #{event_type}")
    nil
  end

  defp translate_event(event) do
    Logger.warning("AgnoDriver: unknown event format #{inspect(event)}")
    nil
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  defp parse_python_dict(nil), do: nil

  defp parse_python_dict(str) when is_binary(str) do
    # Agno returns Python dict strings like "{'success': True, 'result': {...}}"
    # Convert Python syntax to JSON and parse
    str
    |> String.replace(~r/\bTrue\b/, "true")
    |> String.replace(~r/\bFalse\b/, "false")
    |> String.replace(~r/\bNone\b/, "null")
    |> convert_python_quotes()
    |> Jason.decode()
    |> case do
      {:ok, parsed} -> parsed
      {:error, _} -> %{raw: str}
    end
  end

  defp parse_python_dict(other), do: other

  # Convert Python single quotes to JSON double quotes, handling escaped quotes
  # and apostrophes inside double-quoted strings.
  # Python: {'key': "it's working", 'other': 'value'}
  # JSON:   {"key": "it's working", "other": "value"}
  defp convert_python_quotes(str) do
    # Strategy: Python uses single quotes for dict keys/string values,
    # but double quotes for strings containing apostrophes.
    # We convert unescaped single quotes to double quotes.
    str
    |> String.replace(~r/(?<![\\])'/, "\"")
    |> String.replace("\\'", "'")
  end

  defp agno_url do
    Application.get_env(:mindrian, :agno_url, "http://localhost:8000")
  end
end
