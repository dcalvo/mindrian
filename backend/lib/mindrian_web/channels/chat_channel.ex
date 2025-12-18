defmodule MindrianWeb.ChatChannel do
  @moduledoc """
  Phoenix channel for AI chat functionality.

  Handles communication between the frontend and the Agno Python microservice.
  Each user gets their own channel (chat:{user_id}).

  This channel acts as a stateless relay layer:
  - Frontend connects via WebSocket
  - Channel streams requests to Agno via HTTP/SSE
  - SSE responses are parsed and pushed to frontend

  ## Process Model

  The channel process directly handles SSE streaming (no separate tasks).
  One request at a time - user must wait for completion before sending another.
  """
  use MindrianWeb, :channel
  require Logger

  alias Mindrian.Agent.AgnoClient
  alias Mindrian.Agent.SSEParser

  @impl true
  def join("chat:" <> user_id, _payload, socket) do
    if to_string(socket.assigns.user_id) == user_id do
      session_id = generate_session_id()

      socket =
        socket
        |> assign(:session_id, session_id)
        |> assign(:async_resp, nil)
        |> assign(:sse_buffer, "")
        |> assign(:pending_tool, nil)

      Logger.info("User #{user_id} joined chat channel, session #{session_id}")
      {:ok, %{session_id: session_id}, socket}
    else
      {:error, %{reason: "forbidden"}}
    end
  end

  @impl true
  def handle_in("user_message", %{"content" => content} = payload, socket) do
    # Reject if already processing a request
    if socket.assigns.async_resp != nil do
      {:reply, {:error, %{reason: "busy"}}, socket}
    else
      document_id = get_in(payload, ["context", "document_id"])

      case AgnoClient.start_run(content,
             user_id: socket.assigns.user_id,
             session_id: socket.assigns.session_id,
             document_id: document_id
           ) do
        {:ok, resp} ->
          push(socket, "agent_status", %{status: "thinking"})

          socket =
            socket
            |> assign(:async_resp, resp)
            |> assign(:sse_buffer, "")

          {:reply, :ok, socket}

        {:error, reason} ->
          Logger.error("Failed to start agent run: #{inspect(reason)}")
          push(socket, "error", %{message: "Failed to connect to agent"})
          {:reply, {:error, %{reason: "agent_error"}}, socket}
      end
    end
  end

  @impl true
  def handle_in("tool_response", %{"request_id" => _request_id, "approved" => approved}, socket) do
    pending = socket.assigns.pending_tool

    if is_nil(pending) do
      {:reply, {:error, %{reason: "no_pending_tool"}}, socket}
    else
      status = if approved, do: "executing", else: "thinking"
      push(socket, "agent_status", %{status: status})

      # Continue the run - Agno will execute the tool via HTTP callback
      case AgnoClient.continue_run(pending.run_id,
             user_id: socket.assigns.user_id,
             session_id: socket.assigns.session_id,
             tool_call_id: pending.tool_call_id,
             tool_name: pending.tool_name,
             tool_args: pending.tool_input,
             approved: approved
           ) do
        {:ok, resp} ->
          socket =
            socket
            |> assign(:async_resp, resp)
            |> assign(:sse_buffer, "")
            |> assign(:pending_tool, nil)

          {:reply, :ok, socket}

        {:error, reason} ->
          Logger.error("Failed to continue agent run: #{inspect(reason)}")
          push(socket, "error", %{message: "Failed to continue agent"})
          push(socket, "agent_status", %{status: "idle"})
          {:reply, {:error, %{reason: "agent_error"}}, assign(socket, :pending_tool, nil)}
      end
    end
  end

  @impl true
  def handle_in("cancel", _payload, socket) do
    if pending = socket.assigns.pending_tool do
      AgnoClient.cancel(pending.run_id)
    end

    if socket.assigns.async_resp do
      Req.cancel_async_response(socket.assigns.async_resp)
    end

    push(socket, "stream_cancelled", %{})
    push(socket, "agent_status", %{status: "idle"})

    socket =
      socket
      |> assign(:async_resp, nil)
      |> assign(:sse_buffer, "")
      |> assign(:pending_tool, nil)

    {:reply, :ok, socket}
  end

  # Handle SSE stream messages from Req
  @impl true
  def handle_info(message, socket) when socket.assigns.async_resp != nil do
    case Req.parse_message(socket.assigns.async_resp, message) do
      {:ok, chunks} ->
        socket = process_sse_chunks(chunks, socket)
        {:noreply, socket}

      {:error, reason} ->
        Logger.error("SSE stream error: #{inspect(reason)}")
        push(socket, "error", %{message: "Stream error"})
        push(socket, "agent_status", %{status: "idle"})

        socket =
          socket
          |> assign(:async_resp, nil)
          |> assign(:sse_buffer, "")

        {:noreply, socket}

      :unknown ->
        # Message not for us
        {:noreply, socket}
    end
  end

  @impl true
  def handle_info(_message, socket) do
    {:noreply, socket}
  end

  @impl true
  def terminate(_reason, socket) do
    if socket.assigns[:async_resp] do
      Req.cancel_async_response(socket.assigns.async_resp)
    end

    :ok
  end

  # Process SSE data chunks
  defp process_sse_chunks(chunks, socket) do
    Enum.reduce(chunks, socket, fn chunk, socket ->
      case chunk do
        {:data, data} ->
          {events, buffer} = SSEParser.parse(data, socket.assigns.sse_buffer)
          socket = assign(socket, :sse_buffer, buffer)

          Enum.reduce(events, socket, fn event, socket ->
            handle_agno_event(event, socket)
          end)

        :done ->
          # Stream completed
          push(socket, "agent_status", %{status: "idle"})

          socket
          |> assign(:async_resp, nil)
          |> assign(:sse_buffer, "")

        {:trailers, _trailers} ->
          socket
      end
    end)
  end

  # Handle parsed Agno events
  defp handle_agno_event(%{"event" => "RunStarted"}, socket) do
    push(socket, "stream_start", %{})
    socket
  end

  defp handle_agno_event(%{"event" => "RunContinued"}, socket) do
    # Run resumed after tool confirmation - treat like RunStarted
    push(socket, "stream_start", %{})
    socket
  end

  defp handle_agno_event(%{"event" => "RunContent", "content" => content}, socket) do
    push(socket, "stream_delta", %{text: content})
    socket
  end

  defp handle_agno_event(%{"event" => "RunContentCompleted"}, socket) do
    # Informational - content was already streamed
    socket
  end

  defp handle_agno_event(%{"event" => "RunCompleted"}, socket) do
    push(socket, "stream_end", %{})
    socket
  end

  defp handle_agno_event(%{"event" => "RunPaused"} = event, socket) do
    # Tool execution needed (external_execution=True)
    Logger.debug("RunPaused event received: #{inspect(event, pretty: true)}")

    case extract_tool(event) do
      {:ok, tool} ->
        push(socket, "tool_request", %{
          request_id: tool.tool_call_id,
          tool_name: tool.tool_name,
          tool_input: tool.tool_input,
          description: tool.description
        })

        push(socket, "agent_status", %{status: "awaiting_approval"})

        # Clear async_resp (this stream is done), store tool info for execution
        socket
        |> assign(:async_resp, nil)
        |> assign(:sse_buffer, "")
        |> assign(:pending_tool, tool)

      :error ->
        Logger.warning("RunPaused event missing tool info: #{inspect(event)}")
        socket
    end
  end

  defp handle_agno_event(%{"event" => "RunError", "content" => content}, socket) do
    push(socket, "error", %{message: content})
    socket
  end

  defp handle_agno_event(%{"event" => "RunError"}, socket) do
    push(socket, "error", %{message: "Unknown error"})
    socket
  end

  defp handle_agno_event(%{"event" => "ToolCallStarted"}, socket) do
    # Informational - log only
    socket
  end

  defp handle_agno_event(%{"event" => "ToolCallCompleted", "tool" => tool}, socket) do
    request_id = tool["tool_call_id"]
    result = tool["result"]
    success = not tool["tool_call_error"]

    push(socket, "tool_result", %{
      request_id: request_id,
      success: success,
      result: if(success, do: result, else: nil),
      error: if(!success, do: result, else: nil)
    })

    socket
  end

  # Extract tool info from RunPaused event
  # Agno may send multiple tools - find the one that requires confirmation
  defp extract_tool(%{"tools" => tools, "run_id" => run_id}) when is_list(tools) do
    Logger.debug("Extracting tool from #{length(tools)} tools")

    # Find the tool that requires confirmation, or fall back to the last tool
    tool =
      Enum.find(tools, List.last(tools), fn t ->
        t["requires_confirmation"] == true
      end)

    Logger.debug("Selected tool: #{inspect(tool, pretty: true)}")

    if tool do
      {:ok,
       %{
         run_id: run_id,
         tool_call_id: tool["tool_call_id"] || generate_request_id(),
         tool_name: tool["tool_name"],
         tool_input: tool["tool_args"] || %{},
         description: describe_tool(tool)
       }}
    else
      :error
    end
  end

  defp extract_tool(_), do: :error

  defp describe_tool(%{"tool_name" => name, "tool_args" => args}) do
    case name do
      "list_documents" ->
        "List all documents"

      "create_document" ->
        title = args["title"] || "Untitled"
        "Create a new document titled \"#{title}\""

      "read_document" ->
        "Read document #{args["document_id"]}"

      "edit_document" ->
        ops_count = length(args["operations"] || [])
        "Edit document #{args["document_id"]} (#{ops_count} operation(s))"

      "delete_document" ->
        "Delete document #{args["document_id"]}"

      _ ->
        "Execute #{name}"
    end
  end

  defp describe_tool(%{"tool_name" => name}), do: "Execute #{name}"

  defp generate_session_id do
    :crypto.strong_rand_bytes(16) |> Base.url_encode64(padding: false)
  end

  defp generate_request_id do
    :crypto.strong_rand_bytes(8) |> Base.url_encode64(padding: false)
  end
end
