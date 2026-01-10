defmodule Mindrian.Chat.Drivers.ClaudeAgentDriver do
  @moduledoc """
  Driver connecting ConversationServer to the Claude Agent SDK service.

  Implements the `Mindrian.Chat.Driver` behaviour. Uses SSE streaming to
  receive events from the Claude Agent SDK Python service and translates them
  to the standard Driver event format. See `Mindrian.Chat.Driver` for the
  complete event specification.

  ## Configuration

      config :mindrian, :claude_agent_url, "http://localhost:8001"
  """

  @behaviour Mindrian.Chat.Driver

  require Logger

  alias Mindrian.Chat.{Conversation, SSEParser}

  @agent_id "mindrian-claude"
  @timeout 120_000

  # ---------------------------------------------------------------------------
  # Driver Callbacks
  # ---------------------------------------------------------------------------

  # Formats "mcp__mindrian__list_documents" -> "List Documents"
  defp format_tool_name(name) do
    name
    |> String.split("__")
    |> List.last()
    |> String.split("_")
    |> Enum.map_join(" ", &String.capitalize/1)
  end

  @impl true
  def run(%Conversation{} = conv) do
    url = "#{claude_agent_url()}/agents/#{@agent_id}/runs"

    # Get the last user message
    user_message =
      conv.messages
      |> Enum.reverse()
      |> Enum.find(&(&1.role == :user))

    if user_message == nil do
      {:error, "No user message to send"}
    else
      Logger.info("ClaudeAgentDriver: starting run for session=#{conv.id}")

      form_data = [
        {"message", user_message.content},
        {"stream", "true"},
        {"session_id", conv.id},
        {"user_id", conv.scope.user.id},
        {"workspace_id", conv.workspace_id || ""}
      ]

      {:ok, build_event_stream(url, form_data)}
    end
  end

  @impl true
  def continue(run_id, conversation_id, scope, tools) do
    url = "#{claude_agent_url()}/agents/#{@agent_id}/runs/#{run_id}/continue"

    # Build tool decisions list
    tool_decisions =
      Enum.map(tools, fn tool ->
        %{
          tool_call_id: tool.tool_call_id,
          confirmed: tool.confirmed,
          reason: if(tool.confirmed, do: "", else: "User rejected the tool execution")
        }
      end)

    tool_names = Enum.map(tools, & &1.tool_name) |> Enum.join(", ")
    Logger.info("ClaudeAgentDriver: continuing run=#{run_id} with tools=[#{tool_names}]")

    form_data = [
      {"tool_decisions", Jason.encode!(tool_decisions)},
      {"session_id", conversation_id},
      {"user_id", scope.user.id},
      {"workspace_id", ""}
    ]

    {:ok, build_event_stream(url, form_data)}
  end

  @impl true
  def cancel(run_id) do
    Logger.info("ClaudeAgentDriver: cancelling run=#{run_id}")
    # The cancel endpoint needs session_id but we don't have it here
    # For now, just log and return ok - the Python service tracks sessions
    url = "#{claude_agent_url()}/agents/#{@agent_id}/runs/#{run_id}/cancel"

    case Req.post(url,
           form: [{"session_id", ""}],
           receive_timeout: @timeout
         ) do
      {:ok, %{status: 200}} ->
        Logger.info("ClaudeAgentDriver: cancelled run=#{run_id}")
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
  # Event Translation (Claude Agent SDK -> Driver)
  # ---------------------------------------------------------------------------

  defp translate_event(%{"event" => "RunStarted", "run_id" => run_id}) do
    Logger.info("ClaudeAgentDriver: run started run_id=#{run_id}")
    {:run_started, run_id}
  end

  defp translate_event(%{"event" => "TextChunk", "content" => content})
       when is_binary(content) and content != "" do
    {:text_chunk, content}
  end

  defp translate_event(%{"event" => "TextChunk"}) do
    # Empty content chunk - ignore
    nil
  end

  defp translate_event(%{"event" => "TextEnd"}) do
    Logger.debug("ClaudeAgentDriver: text content completed")
    :text_end
  end

  defp translate_event(%{"event" => "ToolStarted"} = event) do
    id = event["tool_call_id"]
    name = event["tool_name"]
    args = event["tool_args"] || %{}
    Logger.info("ClaudeAgentDriver: tool started name=#{name} id=#{id}")
    {:tool_started, id, name, args}
  end

  defp translate_event(%{"event" => "ToolCompleted"} = event) do
    id = event["tool_call_id"]
    result = event["result"]
    Logger.info("ClaudeAgentDriver: tool completed id=#{id}")
    {:tool_completed, id, result}
  end

  defp translate_event(%{"event" => "ToolFailed"} = event) do
    id = event["tool_call_id"]
    error = event["error"] || "Tool execution failed"
    Logger.warning("ClaudeAgentDriver: tool failed id=#{id}")
    {:tool_failed, id, error}
  end

  defp translate_event(%{"event" => "RunPaused", "run_id" => run_id, "tools" => tools}) do
    tool_names = Enum.map(tools, & &1["tool_name"]) |> Enum.join(", ")
    Logger.info("ClaudeAgentDriver: run paused for approval run_id=#{run_id} tools=[#{tool_names}]")

    tool_infos =
      Enum.map(tools, fn tool ->
        %{
          id: tool["tool_call_id"],
          name: tool["tool_name"],
          args: tool["tool_args"] || %{},
          description: format_tool_name(tool["tool_name"])
        }
      end)

    {:paused, run_id, tool_infos}
  end

  defp translate_event(%{"event" => "RunContinued"}) do
    Logger.info("ClaudeAgentDriver: run continued")
    :continued
  end

  defp translate_event(%{"event" => "RunCompleted"}) do
    Logger.info("ClaudeAgentDriver: run completed")
    :complete
  end

  defp translate_event(%{"event" => "RunCancelled"}) do
    Logger.info("ClaudeAgentDriver: run cancelled")
    :complete
  end

  defp translate_event(%{"event" => "RunError", "content" => content}) do
    Logger.error("ClaudeAgentDriver: run error: #{content}")
    {:error, content}
  end

  defp translate_event(%{"event" => event_type}) do
    Logger.debug("ClaudeAgentDriver: ignoring event type #{event_type}")
    nil
  end

  defp translate_event(event) do
    Logger.warning("ClaudeAgentDriver: unknown event format #{inspect(event)}")
    nil
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  defp claude_agent_url do
    Application.get_env(:mindrian, :claude_agent_url, "http://localhost:8001")
  end
end
