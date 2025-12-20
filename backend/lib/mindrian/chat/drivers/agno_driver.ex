defmodule Mindrian.Chat.Drivers.AgnoDriver do
  @moduledoc """
  Driver connecting ConversationServer to the Agno AI agent service.

  Uses SSE streaming to receive events from Agno and translates them
  to the Driver event format.

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
      form_data = [
        {"message", user_message.content},
        {"stream", "true"},
        {"session_id", conv.scope.session_id},
        {"user_id", conv.scope.user.id},
        {"dependencies", Jason.encode!(%{document_id: nil})}
      ]

      {:ok, build_event_stream(url, form_data)}
    end
  end

  @impl true
  def continue(run_id, tools) do
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

    # Get session_id from first tool's context (they all share the same run)
    # For continue, we don't have the scope, so we pass empty strings
    # Agno uses run_id to look up the session
    form_data = [
      {"tools", Jason.encode!(tool_executions)},
      {"stream", "true"}
    ]

    {:ok, build_event_stream(url, form_data)}
  end

  @impl true
  def cancel(run_id) do
    url = "#{agno_url()}/agents/#{@agent_id}/runs/#{run_id}/cancel"

    case Req.post(url, receive_timeout: @timeout) do
      {:ok, %{status: 200}} ->
        :ok

      # Agno returns 500 for already-completed runs - treat as success
      {:ok, %{status: 500}} ->
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
      Process.exit(pid, :kill)
    end
  end

  # ---------------------------------------------------------------------------
  # Event Translation (Agno -> Driver)
  # ---------------------------------------------------------------------------

  defp translate_event(%{"event" => "RunStarted", "run_id" => run_id}) do
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
    :text_end
  end

  defp translate_event(%{"event" => "ToolCallStarted", "tool" => tool}) do
    {:tool_started, tool["tool_call_id"], tool["tool_name"], tool["tool_args"] || %{}}
  end

  defp translate_event(%{"event" => "ToolCallCompleted", "tool" => tool}) do
    id = tool["tool_call_id"]

    if tool["tool_call_error"] do
      {:tool_failed, id, tool["result"] || "Tool execution failed"}
    else
      result = parse_python_dict(tool["result"])
      {:tool_completed, id, result}
    end
  end

  defp translate_event(%{"event" => "RunPaused", "run_id" => run_id, "tools" => tools}) do
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
    :continued
  end

  defp translate_event(%{"event" => "RunCompleted"}) do
    :complete
  end

  defp translate_event(%{"event" => "RunError", "content" => content}) do
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
    |> String.replace("'", "\"")
    |> Jason.decode()
    |> case do
      {:ok, parsed} -> parsed
      {:error, _} -> %{raw: str}
    end
  end

  defp parse_python_dict(other), do: other

  defp agno_url do
    Application.get_env(:mindrian, :agno_url, "http://localhost:8000")
  end
end
