defmodule Mindrian.Agent.AgentServer do
  @moduledoc """
  GenServer managing an AI agent conversation session.

  Each session maintains:
  - Conversation history (messages)
  - Current status (idle, thinking, awaiting_approval, executing)
  - Pending tool requests that need user approval

  The agent runs in a loop:
  1. Receive user message
  2. Call Anthropic API with conversation history and tools
  3. If tool use requested, wait for user approval
  4. Execute approved tools and send results back to API
  5. Repeat until assistant provides final response
  """
  use GenServer
  require Logger

  alias Mindrian.Agent.{Anthropic, Debug, Message, Tools}
  alias Mindrian.Accounts.Scope

  @idle_timeout :timer.minutes(30)
  # Maximum number of messages to include in API calls (prevents context overflow)
  @max_context_messages 50

  # State struct for type safety and documentation
  defmodule State do
    @moduledoc false
    @enforce_keys [:user_id, :session_id, :topic]
    defstruct [
      :user_id,
      :session_id,
      :topic,
      :current_document_id,
      :current_tool,
      :task_ref,
      :streaming_text,
      messages: [],
      status: :idle,
      pending_tools: :queue.new()
    ]

    @type status :: :idle | :thinking | :streaming | :awaiting_approval | :executing

    @type t :: %__MODULE__{
            user_id: integer(),
            session_id: String.t(),
            topic: String.t(),
            current_document_id: String.t() | nil,
            current_tool: map() | nil,
            task_ref: reference() | nil,
            streaming_text: String.t() | nil,
            messages: [map()],
            status: status(),
            pending_tools: :queue.queue()
          }
  end

  # Client API

  @doc """
  Starts an agent server for a user session.
  """
  def start_link(opts) do
    user_id = Keyword.fetch!(opts, :user_id)
    session_id = Keyword.fetch!(opts, :session_id)
    name = via_tuple(user_id, session_id)
    GenServer.start_link(__MODULE__, opts, name: name)
  end

  @doc """
  Sends a user message to the agent.
  """
  def send_message(user_id, session_id, content, context \\ %{}) do
    call_if_exists(user_id, session_id, {:send_message, content, context})
  end

  @doc """
  Responds to a pending tool request.
  """
  def respond_to_tool(user_id, session_id, request_id, approved) do
    call_if_exists(user_id, session_id, {:tool_response, request_id, approved})
  end

  @doc """
  Cancels the current operation.
  """
  def cancel(user_id, session_id) do
    call_if_exists(user_id, session_id, :cancel)
  end

  @doc """
  Gets the current state of the agent session.
  """
  def get_state(user_id, session_id) do
    call_if_exists(user_id, session_id, :get_state)
  end

  @doc """
  Looks up an existing agent server or starts a new one.
  """
  def get_or_start(user_id, session_id) do
    case Registry.lookup(Mindrian.AgentServerRegistry, {user_id, session_id}) do
      [{pid, _}] ->
        {:ok, pid}

      [] ->
        start_link(user_id: user_id, session_id: session_id)
    end
  end

  @doc """
  Returns the PubSub topic for an agent session.
  Callers should subscribe to this topic to receive agent messages.
  """
  def topic(user_id, session_id) do
    "agent:#{user_id}:#{session_id}"
  end

  # Server callbacks

  @impl true
  def init(opts) do
    user_id = Keyword.fetch!(opts, :user_id)
    session_id = Keyword.fetch!(opts, :session_id)

    state = %State{
      user_id: user_id,
      session_id: session_id,
      topic: topic(user_id, session_id)
    }

    Logger.info("AgentServer started for user #{user_id}, session #{session_id}")
    Debug.session_started(user_id, session_id)
    schedule_idle_timeout()

    {:ok, state}
  end

  @impl true
  def handle_call({:send_message, content, context}, _from, state) do
    if state.status != :idle do
      Debug.emit(:message_rejected, %{
        user_id: state.user_id,
        session_id: state.session_id,
        reason: :busy
      })

      {:reply, {:error, :busy}, state}
    else
      Debug.message_received(state.user_id, state.session_id, content)

      # Update current document context
      document_id = context[:document_id] || state.current_document_id
      state = %{state | current_document_id: document_id}

      # Add user message to history
      user_message = Message.user(content)
      messages = state.messages ++ [user_message]
      old_status = state.status
      state = %{state | messages: messages, status: :thinking}

      # Notify status change
      Debug.status_changed(state.user_id, state.session_id, old_status, :thinking)
      send_callback(state, {:status, :thinking})

      # Process message asynchronously
      Debug.task_started(state.user_id, state.session_id, :process_message)
      server = self()
      state = start_task(state, fn -> process_message(server, state) end)

      {:reply, :ok, state}
    end
  end

  @impl true
  def handle_call({:tool_response, request_id, approved}, _from, state) do
    # Only respond to current_tool
    case state.current_tool do
      nil ->
        {:reply, {:error, :not_found}, state}

      %{request_id: ^request_id, tool_name: tool_name} = tool_request ->
        if approved do
          Debug.tool_approved(state.user_id, state.session_id, tool_name, request_id)
          Debug.status_changed(state.user_id, state.session_id, state.status, :executing)
          state = %{state | status: :executing}
          send_callback(state, {:status, :executing})

          # Execute tool asynchronously
          Debug.task_started(state.user_id, state.session_id, :execute_tool)
          server = self()
          state = start_task(state, fn -> execute_tool(server, state, tool_request) end)

          {:reply, :ok, state}
        else
          Debug.tool_rejected(state.user_id, state.session_id, tool_name, request_id)

          # Tool rejected - add rejection result to message history
          tool_result_message = Message.tool_rejected(tool_request.request_id)

          # Clear current tool and queue, rejection cancels all pending tools
          messages = state.messages ++ [tool_result_message]

          Debug.status_changed(state.user_id, state.session_id, state.status, :thinking)

          state = %{
            state
            | messages: messages,
              status: :thinking,
              current_tool: nil,
              pending_tools: :queue.new()
          }

          send_callback(state, {:status, :thinking})

          # Continue with rejection message
          Debug.task_started(state.user_id, state.session_id, :continue_after_rejection)
          server = self()
          state = start_task(state, fn -> continue_with_rejection(server, state) end)

          {:reply, :ok, state}
        end

      _other_tool ->
        # Request ID doesn't match current tool
        {:reply, {:error, :not_found}, state}
    end
  end

  @impl true
  def handle_call(:cancel, _from, state) do
    Debug.cancelled(state.user_id, state.session_id)

    # Demonitor and flush any running task
    if state.task_ref, do: Process.demonitor(state.task_ref, [:flush])

    # If streaming, notify client that stream was cancelled
    if state.status == :streaming do
      send_callback(state, :stream_cancelled)
    end

    Debug.status_changed(state.user_id, state.session_id, state.status, :idle)

    state = %{
      state
      | status: :idle,
        streaming_text: nil,
        current_tool: nil,
        pending_tools: :queue.new(),
        task_ref: nil
    }

    send_callback(state, {:status, :idle})
    {:reply, :ok, state}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, {:ok, state}, state}
  end

  @impl true
  def handle_cast({:api_response, response}, state) do
    Debug.task_completed(state.user_id, state.session_id, :api_call)

    case response do
      {:ok, %{tool_use: tool_use, content: content, stop_reason: stop_reason}}
      when tool_use != [] ->
        Debug.api_response(state.user_id, state.session_id, stop_reason, length(tool_use))

        # Assistant wants to use tools
        # Add assistant message with tool use to history
        assistant_message = Message.assistant_with_tools(content, tool_use)
        messages = state.messages ++ [assistant_message]

        # Create tool requests
        tool_requests =
          Enum.map(tool_use, fn tool ->
            %{
              request_id: tool.id,
              tool_name: tool.name,
              tool_input: tool.input,
              description: Tools.describe_action(tool.name, tool.input)
            }
          end)

        # Queue all tools, set first as current
        {current_tool, pending_queue} = queue_tools(tool_requests)

        Debug.status_changed(state.user_id, state.session_id, state.status, :awaiting_approval)

        state = %{
          state
          | messages: messages,
            status: :awaiting_approval,
            current_tool: current_tool,
            pending_tools: pending_queue
        }

        # Send content if any
        if content != "" do
          Debug.pubsub_broadcast(state.user_id, state.session_id, :assistant_message)
          send_callback(state, {:assistant_message, content})
        end

        # Only send the current tool request for approval (one at a time)
        Debug.tool_requested(
          state.user_id,
          state.session_id,
          current_tool.tool_name,
          current_tool.request_id
        )

        Debug.pubsub_broadcast(state.user_id, state.session_id, :tool_request)
        send_callback(state, {:tool_request, current_tool})
        Debug.pubsub_broadcast(state.user_id, state.session_id, :status)
        send_callback(state, {:status, :awaiting_approval})
        {:noreply, state}

      {:ok, %{content: content, stop_reason: stop_reason}} ->
        Debug.api_response(state.user_id, state.session_id, stop_reason, 0)

        # Final response
        assistant_message = Message.assistant(content)
        messages = state.messages ++ [assistant_message]

        Debug.status_changed(state.user_id, state.session_id, state.status, :idle)

        state = %{
          state
          | messages: messages,
            status: :idle,
            current_tool: nil,
            pending_tools: :queue.new()
        }

        Debug.pubsub_broadcast(state.user_id, state.session_id, :assistant_message)
        send_callback(state, {:assistant_message, content})
        Debug.pubsub_broadcast(state.user_id, state.session_id, :status)
        send_callback(state, {:status, :idle})
        {:noreply, state}

      {:error, reason} ->
        Debug.emit(:api_error, %{
          user_id: state.user_id,
          session_id: state.session_id,
          reason: inspect(reason)
        })

        Logger.error("Anthropic API error: #{inspect(reason)}")

        Debug.status_changed(state.user_id, state.session_id, state.status, :idle)
        state = %{state | status: :idle, current_tool: nil, pending_tools: :queue.new()}

        send_callback(state, {:error, "API error: #{inspect(reason)}"})
        send_callback(state, {:status, :idle})
        {:noreply, state}
    end
  end

  # Streaming event handlers

  @impl true
  def handle_cast(:stream_start, state) do
    Debug.status_changed(state.user_id, state.session_id, state.status, :streaming)
    state = %{state | status: :streaming, streaming_text: ""}
    send_callback(state, {:status, :streaming})
    send_callback(state, :stream_start)
    {:noreply, state}
  end

  @impl true
  def handle_cast({:stream_delta, text}, state) do
    state = %{state | streaming_text: (state.streaming_text || "") <> text}
    send_callback(state, {:stream_delta, text})
    {:noreply, state}
  end

  @impl true
  def handle_cast({:stream_end, tool_use}, state) do
    Debug.task_completed(state.user_id, state.session_id, :api_call)
    content = state.streaming_text || ""

    if tool_use == [] do
      # Final response, no tools
      Debug.api_response(state.user_id, state.session_id, "end_turn", 0)
      assistant_message = Message.assistant(content)
      messages = state.messages ++ [assistant_message]

      Debug.status_changed(state.user_id, state.session_id, state.status, :idle)

      state = %{
        state
        | messages: messages,
          status: :idle,
          streaming_text: nil,
          current_tool: nil,
          pending_tools: :queue.new()
      }

      send_callback(state, {:stream_end, nil})
      send_callback(state, {:status, :idle})
      {:noreply, state}
    else
      # Tools requested
      Debug.api_response(state.user_id, state.session_id, "tool_use", length(tool_use))
      assistant_message = Message.assistant_with_tools(content, tool_use)
      messages = state.messages ++ [assistant_message]

      # Create tool requests
      tool_requests =
        Enum.map(tool_use, fn tool ->
          %{
            request_id: tool.id,
            tool_name: tool.name,
            tool_input: tool.input,
            description: Tools.describe_action(tool.name, tool.input)
          }
        end)

      # Queue all tools, set first as current
      {current_tool, pending_queue} = queue_tools(tool_requests)

      Debug.status_changed(state.user_id, state.session_id, state.status, :awaiting_approval)

      state = %{
        state
        | messages: messages,
          status: :awaiting_approval,
          streaming_text: nil,
          current_tool: current_tool,
          pending_tools: pending_queue
      }

      # Emit stream_end before tool request
      send_callback(state, {:stream_end, nil})

      # Send tool request for approval
      Debug.tool_requested(
        state.user_id,
        state.session_id,
        current_tool.tool_name,
        current_tool.request_id
      )

      send_callback(state, {:tool_request, current_tool})
      send_callback(state, {:status, :awaiting_approval})
      {:noreply, state}
    end
  end

  @impl true
  def handle_cast({:stream_error, reason}, state) do
    Logger.error("Stream error: #{inspect(reason)}")

    Debug.emit(:api_error, %{
      user_id: state.user_id,
      session_id: state.session_id,
      reason: inspect(reason)
    })

    Debug.status_changed(state.user_id, state.session_id, state.status, :idle)

    state = %{
      state
      | status: :idle,
        streaming_text: nil,
        current_tool: nil,
        pending_tools: :queue.new()
    }

    send_callback(state, {:error, "Streaming failed: #{inspect(reason)}"})
    send_callback(state, {:status, :idle})
    {:noreply, state}
  end

  @impl true
  def handle_cast({:tool_executed, tool_request, result}, state) do
    success = match?({:ok, _}, result)
    Debug.tool_executed(state.user_id, state.session_id, tool_request.tool_name, success)

    # Send tool result to client and build message for history
    tool_result_message =
      case result do
        {:ok, data} ->
          Debug.pubsub_broadcast(state.user_id, state.session_id, :tool_result)
          send_callback(state, {:tool_result, tool_request.request_id, true, data})
          Message.tool_success(tool_request.request_id, data)

        {:error, error} ->
          Debug.pubsub_broadcast(state.user_id, state.session_id, :tool_result)
          send_callback(state, {:tool_result, tool_request.request_id, false, error})
          Message.tool_error(tool_request.request_id, error)
      end

    # Add tool result to message history
    messages = state.messages ++ [tool_result_message]
    state = %{state | messages: messages, current_tool: nil}

    # Check if there are more tools in the queue
    case :queue.out(state.pending_tools) do
      {{:value, next_tool}, remaining_queue} ->
        # More tools to process - send next for approval
        Debug.status_changed(state.user_id, state.session_id, state.status, :awaiting_approval)

        state = %{
          state
          | current_tool: next_tool,
            pending_tools: remaining_queue,
            status: :awaiting_approval
        }

        Debug.tool_requested(
          state.user_id,
          state.session_id,
          next_tool.tool_name,
          next_tool.request_id
        )

        send_callback(state, {:tool_request, next_tool})
        send_callback(state, {:status, :awaiting_approval})
        {:noreply, state}

      {:empty, _} ->
        # All tools executed, continue conversation
        Debug.status_changed(state.user_id, state.session_id, state.status, :thinking)
        state = %{state | status: :thinking, pending_tools: :queue.new()}
        send_callback(state, {:status, :thinking})

        # Continue with tool results
        Debug.task_started(state.user_id, state.session_id, :continue_after_tools)
        server = self()
        state = start_task(state, fn -> continue_after_tools(server, state) end)

        {:noreply, state}
    end
  end

  @impl true
  def handle_info(:idle_timeout, state) do
    if state.status == :idle and state.messages == [] do
      Debug.session_timeout(state.user_id, state.session_id)
      Logger.info("AgentServer idle timeout for user #{state.user_id}")
      {:stop, :normal, state}
    else
      schedule_idle_timeout()
      {:noreply, state}
    end
  end

  # Task exited normally - just clear the ref
  @impl true
  def handle_info({:DOWN, ref, :process, _pid, :normal}, %{task_ref: ref} = state)
      when is_reference(ref) do
    {:noreply, %{state | task_ref: nil}}
  end

  # Task crashed - reset to idle and notify user
  @impl true
  def handle_info({:DOWN, ref, :process, _pid, reason}, %{task_ref: ref} = state)
      when is_reference(ref) do
    Debug.task_crashed(state.user_id, state.session_id, reason)
    Logger.error("Agent task crashed: #{inspect(reason)}")

    Debug.status_changed(state.user_id, state.session_id, state.status, :idle)

    state = %{
      state
      | status: :idle,
        task_ref: nil,
        current_tool: nil,
        pending_tools: :queue.new()
    }

    send_callback(state, {:error, "An internal error occurred. Please try again."})
    send_callback(state, {:status, :idle})

    {:noreply, state}
  end

  @impl true
  def handle_info(_msg, state) do
    {:noreply, state}
  end

  # Private functions

  defp via_tuple(user_id, session_id) do
    {:via, Registry, {Mindrian.AgentServerRegistry, {user_id, session_id}}}
  end

  defp call_if_exists(user_id, session_id, message) do
    case Registry.lookup(Mindrian.AgentServerRegistry, {user_id, session_id}) do
      [{pid, _}] -> GenServer.call(pid, message)
      [] -> {:error, :not_found}
    end
  end

  defp schedule_idle_timeout do
    Process.send_after(self(), :idle_timeout, @idle_timeout)
  end

  # Starts a fire-and-forget task with explicit monitoring for crash detection
  defp start_task(state, fun) do
    {:ok, pid} = Task.Supervisor.start_child(Mindrian.AgentTaskSupervisor, fun)
    ref = Process.monitor(pid)
    %{state | task_ref: ref}
  end

  defp send_callback(state, message) do
    Phoenix.PubSub.broadcast(Mindrian.PubSub, state.topic, {:agent, message})
  end

  # Takes a list of tool requests, returns {current_tool, queue_of_remaining}
  defp queue_tools([first | rest]) do
    queue = Enum.reduce(rest, :queue.new(), fn tool, q -> :queue.in(tool, q) end)
    {first, queue}
  end

  defp queue_tools([]) do
    {nil, :queue.new()}
  end

  defp process_message(server_pid, state) do
    # Build system prompt with document context
    system = build_system_prompt(state.current_document_id)

    # Transform and trim internal messages to API format
    api_messages =
      state.messages
      |> prepare_messages_for_api()
      |> Message.to_anthropic_messages()

    # Call Anthropic API with streaming
    Debug.api_request(state.user_id, state.session_id, length(api_messages), true)

    # Define callback that sends events to the GenServer
    callback = fn
      :stream_start ->
        GenServer.cast(server_pid, :stream_start)

      {:stream_delta, text} ->
        GenServer.cast(server_pid, {:stream_delta, text})

      {:stream_end, tool_use} ->
        GenServer.cast(server_pid, {:stream_end, tool_use})

      {:stream_error, reason} ->
        GenServer.cast(server_pid, {:stream_error, reason})
    end

    try do
      result =
        Anthropic.stream_chat(
          api_messages,
          callback,
          tools: Tools.definitions(),
          system: system
        )

      Debug.emit(:api_call_completed, %{
        user_id: state.user_id,
        session_id: state.session_id,
        success: result == :ok
      })
    rescue
      e ->
        Debug.emit(:api_exception, %{
          user_id: state.user_id,
          session_id: state.session_id,
          error: Exception.message(e),
          stacktrace: Exception.format_stacktrace(__STACKTRACE__)
        })

        GenServer.cast(server_pid, {:stream_error, {:exception, Exception.message(e)}})
    end
  end

  defp execute_tool(server_pid, state, tool_request) do
    # Build scope for the user
    scope = build_scope(state.user_id)

    result =
      Tools.execute(
        tool_request.tool_name,
        tool_request.tool_input,
        scope
      )

    GenServer.cast(server_pid, {:tool_executed, tool_request, result})
  end

  defp continue_with_rejection(server_pid, state) do
    # Messages already include the rejection tool_result, continue with streaming
    process_message(server_pid, state)
  end

  defp continue_after_tools(server_pid, state) do
    # Messages already include the tool_result, continue with streaming
    process_message(server_pid, state)
  end

  # Prepares messages for the API by keeping only the most recent ones
  # to prevent context window overflow
  defp prepare_messages_for_api(messages) do
    messages
    |> Enum.take(-@max_context_messages)
  end

  alias Mindrian.Collaboration.DocServer

  @base_system_prompt """
  You are a helpful AI assistant integrated into Mindrian, a collaborative document platform.
  You can help users create, read, edit, and delete their documents.

  When using tools:
  - Always explain what you're about to do before using a tool
  - If a tool request is rejected, acknowledge it and suggest alternatives
  - Be concise but helpful in your responses
  """

  defp build_system_prompt(nil) do
    @base_system_prompt
  end

  defp build_system_prompt(document_id) do
    case DocServer.get_blocks(document_id) do
      {:ok, blocks} ->
        preview = format_blocks_preview(blocks)

        """
        #{@base_system_prompt}

        The user is currently viewing document ID: #{document_id}

        Document preview (first 10 blocks):
        #{preview}

        Use read_document for full content if needed, or edit_document to make changes.
        """

      _ ->
        # Fallback if document can't be read
        """
        #{@base_system_prompt}

        The user is currently viewing document ID: #{document_id}
        You can reference this document in your responses and use tools to read or edit it.
        """
    end
  end

  defp format_blocks_preview(blocks) do
    blocks
    |> Enum.take(10)
    |> Enum.map_join("\n", fn block ->
      content = block[:content] || ""
      truncated = String.slice(content, 0..100)
      "- [#{block[:type]}] #{truncated}"
    end)
  end

  defp build_scope(user_id) do
    user = Mindrian.Accounts.get_user!(user_id)
    %Scope{user: user}
  end
end
