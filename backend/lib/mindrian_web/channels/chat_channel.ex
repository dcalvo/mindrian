defmodule MindrianWeb.ChatChannel do
  @moduledoc """
  Phoenix channel for chat conversations.

  Wires up the ConversationServer to the frontend via WebSocket.
  Each channel instance owns a ConversationServer and links to it,
  so the server dies when the channel dies (user disconnects).

  ## Topic Format

      "chat:" <> conversation_id

  ## Incoming Messages

      - "send_message" %{"id" => string, "content" => string} - Send a user message
      - "approve_tool_call" %{"tool_id" => string} - Approve a tool call
      - "reject_tool_call" %{"tool_id" => string, "reason" => string?} - Reject a tool call
      - "cancel" %{} - Cancel the current run

  ## Outgoing Events

  Events are pushed as "event" messages with a type field.
  See `Mindrian.Chat.Event` for event types.
  """

  use Phoenix.Channel

  require Logger

  alias Mindrian.Accounts.Scope
  alias Mindrian.Chat.ConversationServer

  @impl true
  def join("chat:" <> conversation_id, _payload, socket) do
    user_id = socket.assigns.user_id

    # Load user from database
    case Mindrian.Accounts.get_user(user_id) do
      nil ->
        {:error, %{reason: "user_not_found"}}

      user ->
        scope = Scope.for_user(user)
        driver = Application.get_env(:mindrian, :chat_driver)

        case ConversationServer.start_link(
               scope: scope,
               driver: driver,
               conversation_id: conversation_id
             ) do
          {:ok, pid} ->
            # Subscribe to conversation events
            topic = "conversation:#{conversation_id}"
            Phoenix.PubSub.subscribe(Mindrian.PubSub, topic)

            # Get initial conversation state
            conv = ConversationServer.get_conversation(pid)

            socket =
              socket
              |> assign(:server, pid)
              |> assign(:conversation_id, conversation_id)

            {:ok, conversation_to_reply(conv), socket}

          {:error, reason} ->
            Logger.error("Failed to start ConversationServer: #{inspect(reason)}")
            {:error, %{reason: "server_start_failed"}}
        end
    end
  end

  # ---------------------------------------------------------------------------
  # Incoming Messages
  # ---------------------------------------------------------------------------

  @impl true
  def handle_in("send_message", %{"id" => message_id, "content" => content}, socket) do
    case ConversationServer.send_message(socket.assigns.server, message_id, content) do
      :ok ->
        {:reply, :ok, socket}

      {:error, {:not_your_turn, details}} ->
        {:reply,
         {:error, %{code: "not_your_turn", message: "Cannot send message: #{inspect(details)}"}},
         socket}

      {:error, reason} ->
        {:reply, {:error, %{code: "send_failed", message: inspect(reason)}}, socket}
    end
  end

  @impl true
  def handle_in("approve_tool_call", %{"tool_id" => tool_id}, socket) do
    case ConversationServer.approve_tool_call(socket.assigns.server, tool_id) do
      :ok ->
        {:reply, :ok, socket}

      {:error, {:invalid_status, details}} ->
        {:reply,
         {:error, %{code: "invalid_status", message: "Cannot approve: #{inspect(details)}"}},
         socket}

      {:error, {:tool_not_found, id}} ->
        {:reply, {:error, %{code: "tool_not_found", message: "Tool #{id} not found"}}, socket}

      {:error, reason} ->
        {:reply, {:error, %{code: "approve_failed", message: inspect(reason)}}, socket}
    end
  end

  @impl true
  def handle_in("reject_tool_call", %{"tool_id" => tool_id} = payload, socket) do
    rejection_reason = Map.get(payload, "reason")

    case ConversationServer.reject_tool_call(socket.assigns.server, tool_id, rejection_reason) do
      :ok ->
        {:reply, :ok, socket}

      {:error, {:invalid_status, details}} ->
        {:reply,
         {:error, %{code: "invalid_status", message: "Cannot reject: #{inspect(details)}"}},
         socket}

      {:error, {:tool_not_found, id}} ->
        {:reply, {:error, %{code: "tool_not_found", message: "Tool #{id} not found"}}, socket}

      {:error, reason} ->
        {:reply, {:error, %{code: "reject_failed", message: inspect(reason)}}, socket}
    end
  end

  @impl true
  def handle_in("cancel", _payload, socket) do
    case ConversationServer.cancel(socket.assigns.server) do
      :ok ->
        {:reply, :ok, socket}

      {:error, reason} ->
        {:reply, {:error, %{code: "cancel_failed", message: inspect(reason)}}, socket}
    end
  end

  # ---------------------------------------------------------------------------
  # PubSub Events
  # ---------------------------------------------------------------------------

  @impl true
  def handle_info(%Phoenix.Socket.Broadcast{event: "event", payload: payload}, socket) do
    push(socket, "event", payload)
    {:noreply, socket}
  end

  @impl true
  def handle_info(msg, socket) do
    Logger.debug("ChatChannel received unexpected message: #{inspect(msg)}")
    {:noreply, socket}
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  defp conversation_to_reply(conv) do
    %{
      id: conv.id,
      status: conv.status,
      messages: Enum.map(conv.messages, &message_to_map/1),
      pending_error: conv.pending_error
    }
  end

  defp message_to_map(msg) do
    base = %{
      id: msg.id,
      role: msg.role,
      content: msg.content,
      status: msg.status,
      inserted_at: msg.inserted_at
    }

    # Add tool-specific fields for tool_call messages
    if msg.role == :tool_call do
      base
      |> Map.put(:name, msg.name)
      |> Map.put(:arguments, msg.arguments)
      |> Map.put(:description, msg.description)
      |> Map.put(:result, msg.result)
      |> Map.put(:error, msg.error)
      |> Map.put(:rejection_reason, msg.rejection_reason)
    else
      base
    end
  end
end
