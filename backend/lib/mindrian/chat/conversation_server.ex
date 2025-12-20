defmodule Mindrian.Chat.ConversationServer do
  @moduledoc """
  GenServer that orchestrates a chat conversation.

  Owns a `Conversation` struct and coordinates with a `Driver` to
  communicate with the AI agent. Broadcasts events via PubSub.

  ## Starting a Server

      {:ok, pid} = ConversationServer.start_link(
        conversation_id: "conv-123",
        driver: Mindrian.Chat.Drivers.AgnoDriver
      )

  ## User Actions

      # Send a message
      ConversationServer.send_message(pid, "Hello!")

      # Approve a tool call
      ConversationServer.approve_tool_call(pid, "tool-1")

      # Reject a tool call
      ConversationServer.reject_tool_call(pid, "tool-1", "I don't want that")

      # Cancel the current run
      ConversationServer.cancel(pid)

  ## PubSub

  Subscribe to `conversation:CONVERSATION_ID` for events.
  Events are broadcast as `%{type: "...", ...}` maps (JSON-compatible).
  """

  use GenServer
  require Logger

  alias Mindrian.Chat.{Conversation, Event}

  @registry Mindrian.ConversationServerRegistry

  defstruct [
    :conversation,
    :run_id,
    :driver,
    :task,
    :topic
  ]

  # ---------------------------------------------------------------------------
  # Client API
  # ---------------------------------------------------------------------------

  @doc """
  Start a ConversationServer.

  Options:
  - `:conversation_id` (required) - unique ID for this conversation
  - `:driver` (required) - driver module implementing `Mindrian.Chat.Driver`
  """
  def start_link(opts) do
    conversation_id = Keyword.fetch!(opts, :conversation_id)
    name = {:via, Registry, {@registry, conversation_id}}
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Get the ConversationServer pid for a conversation ID.
  Returns `{:ok, pid}` or `{:error, :not_found}`.
  """
  def whereis(conversation_id) do
    case Registry.lookup(@registry, conversation_id) do
      [{pid, _}] -> {:ok, pid}
      [] -> {:error, :not_found}
    end
  end

  @doc """
  Send a user message. Triggers an agent run.
  """
  def send_message(server, content) do
    GenServer.call(server, {:send_message, content})
  end

  @doc """
  Approve a tool call.
  """
  def approve_tool_call(server, tool_id) do
    GenServer.call(server, {:approve_tool_call, tool_id})
  end

  @doc """
  Reject a tool call with optional reason.
  """
  def reject_tool_call(server, tool_id, reason \\ nil) do
    GenServer.call(server, {:reject_tool_call, tool_id, reason})
  end

  @doc """
  Cancel the current run.
  """
  def cancel(server) do
    GenServer.call(server, :cancel)
  end

  @doc """
  Get the current conversation state.
  """
  def get_conversation(server) do
    GenServer.call(server, :get_conversation)
  end

  # ---------------------------------------------------------------------------
  # GenServer Callbacks
  # ---------------------------------------------------------------------------

  @impl true
  def init(opts) do
    conversation_id = Keyword.fetch!(opts, :conversation_id)
    driver = Keyword.fetch!(opts, :driver)

    state = %__MODULE__{
      conversation: Conversation.new(conversation_id),
      driver: driver,
      topic: "conversation:#{conversation_id}"
    }

    Logger.debug("ConversationServer started for #{conversation_id}")
    {:ok, state}
  end

  @impl true
  def handle_call({:send_message, content}, _from, state) do
    message_id = generate_id()

    case Conversation.send_message(state.conversation, message_id, content) do
      {:ok, conv, events} ->
        state = %{state | conversation: conv}
        broadcast_events(state, events)

        # Start the driver run
        case state.driver.run(conv) do
          {:ok, run_id, enumerable} ->
            state = %{state | run_id: run_id}
            state = spawn_driver_task(state, enumerable)
            {:reply, :ok, state}

          {:error, reason} ->
            {:ok, conv, error_events} = Conversation.set_error(conv, "Driver failed: #{inspect(reason)}")
            {:ok, conv, idle_events} = Conversation.complete_run(conv)
            state = %{state | conversation: conv}
            broadcast_events(state, error_events ++ idle_events)
            {:reply, {:error, reason}, state}
        end

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call({:approve_tool_call, tool_id}, _from, state) do
    case Conversation.approve_tool_call(state.conversation, tool_id) do
      {:ok, conv, events} ->
        state = %{state | conversation: conv}
        broadcast_events(state, events)

        # Check if we should continue (no more pending approvals)
        state = maybe_continue_after_decision(state)

        {:reply, :ok, state}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call({:reject_tool_call, tool_id, reason}, _from, state) do
    case Conversation.reject_tool_call(state.conversation, tool_id, reason) do
      {:ok, conv, events} ->
        state = %{state | conversation: conv}
        broadcast_events(state, events)

        # After rejection, we transition to running - need to continue
        state = maybe_continue_after_decision(state)

        {:reply, :ok, state}

      {:error, reason} ->
        {:reply, {:error, reason}, state}
    end
  end

  @impl true
  def handle_call(:cancel, _from, state) do
    state = do_cancel(state)
    {:reply, :ok, state}
  end

  @impl true
  def handle_call(:get_conversation, _from, state) do
    {:reply, state.conversation, state}
  end

  # ---------------------------------------------------------------------------
  # Driver Event Handling
  # ---------------------------------------------------------------------------

  @impl true
  def handle_info({:driver_event, event}, state) do
    state = handle_driver_event(event, state)
    {:noreply, state}
  end

  # Task succeeded - demonitor and clear
  @impl true
  def handle_info({ref, _result}, state) when is_reference(ref) do
    Process.demonitor(ref, [:flush])

    if state.task && state.task.ref == ref do
      {:noreply, %{state | task: nil}}
    else
      {:noreply, state}
    end
  end

  # Task exited (success or failure)
  @impl true
  def handle_info({:DOWN, ref, :process, _pid, reason}, state) do
    if state.task && state.task.ref == ref do
      state = %{state | task: nil}

      case reason do
        :normal ->
          {:noreply, state}

        _error ->
          # Driver crashed
          {:ok, conv, events} =
            Conversation.set_error(state.conversation, "Driver crashed: #{inspect(reason)}")

          state = %{state | conversation: conv, run_id: nil}
          broadcast_events(state, events)
          {:noreply, state}
      end
    else
      {:noreply, state}
    end
  end

  @impl true
  def handle_info(msg, state) do
    Logger.debug("ConversationServer received unexpected message: #{inspect(msg)}")
    {:noreply, state}
  end

  # ---------------------------------------------------------------------------
  # Driver Event Processing
  # ---------------------------------------------------------------------------

  defp handle_driver_event({:text_chunk, content}, state) do
    if Conversation.streaming?(state.conversation) do
      # Append to existing streaming message
      case Conversation.append_chunk(state.conversation, content) do
        {:ok, conv, events} ->
          broadcast_events(state, events)
          %{state | conversation: conv}

        {:error, _reason} ->
          Logger.warning("Failed to append chunk: message not streaming")
          state
      end
    else
      # Start new agent message, then append
      case Conversation.start_agent_message(state.conversation) do
        {:ok, conv, events} ->
          broadcast_events(state, events)

          case Conversation.append_chunk(conv, content) do
            {:ok, conv, chunk_events} ->
              broadcast_events(state, chunk_events)
              %{state | conversation: conv}

            {:error, _reason} ->
              %{state | conversation: conv}
          end

        {:error, reason} ->
          Logger.warning("Failed to start agent message: #{inspect(reason)}")
          state
      end
    end
  end

  defp handle_driver_event(:text_end, state) do
    case Conversation.complete_agent_message(state.conversation) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv}

      {:error, _reason} ->
        # No streaming message to complete - that's ok
        state
    end
  end

  defp handle_driver_event({:tool_started, id, name, args}, state) do
    # Auto-approved tool - add and immediately execute
    # Use tool name as description since Agno doesn't provide it
    description = "Execute #{name}"

    case Conversation.request_approved_tool_call(state.conversation, id, name, args, description) do
      {:ok, conv, events} ->
        broadcast_events(state, events)

        case Conversation.execute_approved_tool(conv, id) do
          {:ok, conv, exec_events} ->
            broadcast_events(state, exec_events)
            %{state | conversation: conv}

          {:error, reason} ->
            Logger.warning("Failed to execute tool #{id}: #{inspect(reason)}")
            %{state | conversation: conv}
        end

      {:error, reason} ->
        Logger.warning("Failed to add tool call #{id}: #{inspect(reason)}")
        state
    end
  end

  defp handle_driver_event({:tool_completed, id, result}, state) do
    case Conversation.complete_tool_call(state.conversation, id, result) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv}

      {:error, reason} ->
        Logger.warning("Failed to complete tool #{id}: #{inspect(reason)}")
        state
    end
  end

  defp handle_driver_event({:tool_failed, id, error}, state) do
    case Conversation.fail_tool_call(state.conversation, id, error) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv}

      {:error, reason} ->
        Logger.warning("Failed to fail tool #{id}: #{inspect(reason)}")
        state
    end
  end

  defp handle_driver_event({:paused, run_id, tools}, state) do
    # Run paused for approval - add tool calls and await
    state = %{state | run_id: run_id}

    # Add each pending tool
    conv =
      Enum.reduce(tools, state.conversation, fn tool, conv ->
        case Conversation.request_tool_call(
               conv,
               tool.id,
               tool.name,
               tool.args,
               tool.description
             ) do
          {:ok, new_conv, events} ->
            broadcast_events(state, events)
            new_conv

          {:error, reason} ->
            Logger.warning("Failed to add tool #{tool.id}: #{inspect(reason)}")
            conv
        end
      end)

    # Transition to awaiting_approval
    case Conversation.await_approval(conv) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv}

      {:error, :no_pending_approvals} ->
        Logger.warning("Paused but no pending approvals")
        %{state | conversation: conv}

      {:error, reason} ->
        Logger.warning("Failed to await approval: #{inspect(reason)}")
        %{state | conversation: conv}
    end
  end

  defp handle_driver_event(:continued, state) do
    # Run continued - no state change needed
    state
  end

  defp handle_driver_event(:complete, state) do
    case Conversation.complete_run(state.conversation) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv, run_id: nil}

      {:error, reason} ->
        Logger.warning("Failed to complete run: #{inspect(reason)}")
        state
    end
  end

  defp handle_driver_event({:error, reason}, state) do
    {:ok, conv, events} = Conversation.set_error(state.conversation, reason)
    broadcast_events(state, events)

    # Also complete the run on error
    case Conversation.complete_run(conv) do
      {:ok, conv, complete_events} ->
        broadcast_events(state, complete_events)
        %{state | conversation: conv, run_id: nil}

      {:error, _} ->
        # Already idle or other state issue
        %{state | conversation: conv, run_id: nil}
    end
  end

  # ---------------------------------------------------------------------------
  # Helpers
  # ---------------------------------------------------------------------------

  defp spawn_driver_task(state, enumerable) do
    server = self()

    task =
      Task.Supervisor.async_nolink(Mindrian.DriverTaskSupervisor, fn ->
        Enum.each(enumerable, fn event ->
          send(server, {:driver_event, event})
        end)
      end)

    %{state | task: task}
  end

  defp maybe_continue_after_decision(state) do
    # Check if we're in running state with approved/rejected tools
    # and need to continue the driver run
    conv = state.conversation

    if conv.status == :running and state.run_id != nil do
      # Collect tool decisions from the conversation
      tools = collect_tool_decisions(conv)

      if tools != [] do
        # Continue the driver with tool decisions
        case state.driver.continue(state.run_id, tools) do
          {:ok, enumerable} ->
            spawn_driver_task(state, enumerable)

          {:error, reason} ->
            {:ok, conv, error_events} =
              Conversation.set_error(conv, "Driver continue failed: #{inspect(reason)}")

            {:ok, conv, idle_events} = Conversation.complete_run(conv)
            broadcast_events(state, error_events ++ idle_events)
            %{state | conversation: conv, run_id: nil}
        end
      else
        state
      end
    else
      state
    end
  end

  defp collect_tool_decisions(conv) do
    conv.messages
    |> Enum.filter(fn msg -> msg.role == :tool_call end)
    |> Enum.filter(fn tc -> tc.status in [:approved, :rejected] end)
    |> Enum.map(fn tc ->
      %{
        tool_call_id: tc.id,
        tool_name: tc.name,
        tool_args: tc.arguments,
        confirmed: tc.status == :approved
      }
    end)
  end

  defp do_cancel(state) do
    # Shutdown the task if running
    if state.task do
      Task.shutdown(state.task, :brutal_kill)
    end

    # Tell driver to cancel
    if state.run_id do
      state.driver.cancel(state.run_id)
    end

    # Cancel in conversation state
    case Conversation.cancel(state.conversation) do
      {:ok, conv, events} ->
        broadcast_events(state, events)
        %{state | conversation: conv, run_id: nil, task: nil}

      {:error, _reason} ->
        # Already idle
        %{state | run_id: nil, task: nil}
    end
  end

  defp broadcast_events(state, events) do
    for event <- events do
      payload = Event.to_map(event)
      MindrianWeb.Endpoint.broadcast(state.topic, "event", payload)
    end
  end

  defp generate_id, do: Nanoid.generate()
end
