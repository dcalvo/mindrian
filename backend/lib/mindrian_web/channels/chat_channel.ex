defmodule MindrianWeb.ChatChannel do
  @moduledoc """
  Phoenix channel for AI chat functionality.

  Handles the communication between the frontend and the AgentServer.
  Each user gets their own channel (chat:{user_id}) and can have
  multiple chat sessions.
  """
  use MindrianWeb, :channel
  require Logger

  alias Mindrian.Agent

  @impl true
  def join("chat:" <> user_id, _payload, socket) do
    # Verify user can only join their own chat channel
    if to_string(socket.assigns.user_id) == user_id do
      # Generate a unique session ID for this channel connection
      session_id = generate_session_id()
      socket = assign(socket, :session_id, session_id)

      # Start or get the agent session and subscribe to its PubSub topic
      case Agent.start_session(socket.assigns.user_id, session_id) do
        {:ok, topic} ->
          Phoenix.PubSub.subscribe(Mindrian.PubSub, topic)
          Logger.info("User #{user_id} joined chat channel, session #{session_id}")
          {:ok, %{session_id: session_id}, socket}

        {:error, reason} ->
          Logger.error("Failed to start agent session: #{inspect(reason)}")
          {:error, %{reason: "failed_to_start_agent"}}
      end
    else
      {:error, %{reason: "forbidden"}}
    end
  end

  @impl true
  def handle_in("user_message", %{"content" => content} = payload, socket) do
    document_id = get_in(payload, ["context", "document_id"])

    case Agent.send_message(
           socket.assigns.user_id,
           socket.assigns.session_id,
           content,
           document_id: document_id
         ) do
      :ok ->
        {:reply, :ok, socket}

      {:error, :busy} ->
        {:reply, {:error, %{reason: "agent_busy"}}, socket}

      {:error, :not_found} ->
        {:reply, {:error, %{reason: "session_not_found"}}, socket}
    end
  end

  @impl true
  def handle_in("tool_response", %{"request_id" => request_id, "approved" => approved}, socket) do
    case Agent.respond_to_tool(
           socket.assigns.user_id,
           socket.assigns.session_id,
           request_id,
           approved
         ) do
      :ok ->
        {:reply, :ok, socket}

      {:error, :not_found} ->
        {:reply, {:error, %{reason: "request_not_found"}}, socket}
    end
  end

  @impl true
  def handle_in("cancel", _payload, socket) do
    Agent.cancel(socket.assigns.user_id, socket.assigns.session_id)
    {:reply, :ok, socket}
  end

  # Handle messages from the AgentServer
  @impl true
  def handle_info({:agent, message}, socket) do
    case message do
      {:status, status} ->
        push(socket, "agent_status", %{status: to_string(status)})

      {:assistant_message, content} ->
        push(socket, "assistant_message", %{content: content})

      {:tool_request, tool} ->
        push(socket, "tool_request", %{
          request_id: tool.request_id,
          tool_name: tool.tool_name,
          tool_input: tool.tool_input,
          description: tool.description
        })

      {:tool_result, request_id, success, result} ->
        push(socket, "tool_result", %{
          request_id: request_id,
          success: success,
          result: if(success, do: result, else: nil),
          error: if(!success, do: result, else: nil)
        })

      {:error, error_message} ->
        push(socket, "error", %{message: error_message})
    end

    {:noreply, socket}
  end

  @impl true
  def handle_info(_msg, socket) do
    {:noreply, socket}
  end

  defp generate_session_id do
    :crypto.strong_rand_bytes(16) |> Base.url_encode64(padding: false)
  end
end
