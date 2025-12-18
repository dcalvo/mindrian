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

  alias Mindrian.Agent.{Anthropic, Tools}
  alias Mindrian.Accounts.Scope

  @idle_timeout :timer.minutes(30)

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
  def get_or_start(user_id, session_id, callback_pid) do
    case Registry.lookup(Mindrian.AgentServerRegistry, {user_id, session_id}) do
      [{pid, _}] ->
        {:ok, pid}

      [] ->
        start_link(
          user_id: user_id,
          session_id: session_id,
          callback_pid: callback_pid
        )
    end
  end

  # Server callbacks

  @impl true
  def init(opts) do
    user_id = Keyword.fetch!(opts, :user_id)
    session_id = Keyword.fetch!(opts, :session_id)
    callback_pid = Keyword.fetch!(opts, :callback_pid)

    state = %{
      user_id: user_id,
      session_id: session_id,
      callback_pid: callback_pid,
      messages: [],
      status: :idle,
      pending_tools: [],
      current_document_id: nil
    }

    Logger.info("AgentServer started for user #{user_id}, session #{session_id}")
    schedule_idle_timeout()

    {:ok, state}
  end

  @impl true
  def handle_call({:send_message, content, context}, _from, state) do
    if state.status != :idle do
      {:reply, {:error, :busy}, state}
    else
      # Update current document context
      document_id = context[:document_id] || state.current_document_id
      state = %{state | current_document_id: document_id}

      # Add user message to history
      user_message = %{role: "user", content: content}
      messages = state.messages ++ [user_message]
      state = %{state | messages: messages, status: :thinking}

      # Notify status change
      send_callback(state, {:status, :thinking})

      # Process message asynchronously
      server_pid = self()
      spawn_link(fn -> process_message(server_pid, state) end)

      {:reply, :ok, state}
    end
  end

  @impl true
  def handle_call({:tool_response, request_id, approved}, _from, state) do
    case find_pending_tool(state.pending_tools, request_id) do
      nil ->
        {:reply, {:error, :not_found}, state}

      tool_request ->
        if approved do
          state = %{state | status: :executing}
          send_callback(state, {:status, :executing})

          # Execute tool asynchronously
          server_pid = self()
          spawn_link(fn -> execute_tool(server_pid, state, tool_request) end)

          {:reply, :ok, state}
        else
          # Tool rejected - add rejection result to message history
          tool_result_message = %{
            role: "user",
            content: [
              %{
                type: "tool_result",
                tool_use_id: tool_request.request_id,
                content: "The user rejected this tool request.",
                is_error: true
              }
            ]
          }

          messages = state.messages ++ [tool_result_message]
          state = %{state | messages: messages, status: :thinking, pending_tools: []}
          send_callback(state, {:status, :thinking})

          # Continue with rejection message
          server_pid = self()
          spawn_link(fn -> continue_with_rejection(server_pid, state) end)

          {:reply, :ok, state}
        end
    end
  end

  @impl true
  def handle_call(:cancel, _from, state) do
    state = %{state | status: :idle, pending_tools: []}
    send_callback(state, {:status, :idle})
    {:reply, :ok, state}
  end

  @impl true
  def handle_call(:get_state, _from, state) do
    {:reply, {:ok, state}, state}
  end

  @impl true
  def handle_cast({:api_response, response}, state) do
    case response do
      {:ok, %{tool_use: tool_use, content: content, stop_reason: _stop_reason}}
      when tool_use != [] ->
        # Assistant wants to use tools
        # Add assistant message with tool use to history
        assistant_message = build_assistant_message(content, tool_use)
        messages = state.messages ++ [assistant_message]

        # Create pending tool requests
        pending_tools =
          Enum.map(tool_use, fn tool ->
            %{
              request_id: tool.id,
              tool_name: tool.name,
              tool_input: tool.input,
              description: Tools.describe_action(tool.name, tool.input)
            }
          end)

        state = %{state | messages: messages, status: :awaiting_approval, pending_tools: pending_tools}

        # Send content if any
        if content != "" do
          send_callback(state, {:assistant_message, content})
        end

        # Send tool requests for approval
        Enum.each(pending_tools, fn tool ->
          send_callback(state, {:tool_request, tool})
        end)

        send_callback(state, {:status, :awaiting_approval})
        {:noreply, state}

      {:ok, %{content: content, stop_reason: "end_turn"}} ->
        # Final response
        assistant_message = %{role: "assistant", content: content}
        messages = state.messages ++ [assistant_message]
        state = %{state | messages: messages, status: :idle, pending_tools: []}

        send_callback(state, {:assistant_message, content})
        send_callback(state, {:status, :idle})
        {:noreply, state}

      {:ok, %{content: content}} ->
        # Some other stop reason, treat as final
        assistant_message = %{role: "assistant", content: content}
        messages = state.messages ++ [assistant_message]
        state = %{state | messages: messages, status: :idle, pending_tools: []}

        send_callback(state, {:assistant_message, content})
        send_callback(state, {:status, :idle})
        {:noreply, state}

      {:error, reason} ->
        Logger.error("Anthropic API error: #{inspect(reason)}")
        state = %{state | status: :idle}

        send_callback(state, {:error, "API error: #{inspect(reason)}"})
        send_callback(state, {:status, :idle})
        {:noreply, state}
    end
  end

  @impl true
  def handle_cast({:tool_executed, tool_request, result}, state) do
    # Send tool result to client
    case result do
      {:ok, data} ->
        send_callback(state, {:tool_result, tool_request.request_id, true, data})

      {:error, error} ->
        send_callback(state, {:tool_result, tool_request.request_id, false, error})
    end

    # Build tool result content and add to message history
    content =
      case result do
        {:ok, data} -> Jason.encode!(data)
        {:error, error} -> "Error: #{error}"
      end

    tool_result_message = %{
      role: "user",
      content: [
        %{
          type: "tool_result",
          tool_use_id: tool_request.request_id,
          content: content
        }
        |> maybe_add_tool_error(match?({:error, _}, result))
      ]
    }

    # Add tool result to message history
    messages = state.messages ++ [tool_result_message]
    state = %{state | messages: messages}

    # Remove from pending tools
    remaining_tools = Enum.reject(state.pending_tools, &(&1.request_id == tool_request.request_id))

    if remaining_tools == [] do
      # All tools executed, continue conversation
      state = %{state | status: :thinking, pending_tools: []}
      send_callback(state, {:status, :thinking})

      # Continue with tool results
      server_pid = self()
      spawn_link(fn -> continue_after_tools(server_pid, state) end)

      {:noreply, state}
    else
      # More tools pending
      state = %{state | pending_tools: remaining_tools, status: :awaiting_approval}
      send_callback(state, {:status, :awaiting_approval})
      {:noreply, state}
    end
  end

  @impl true
  def handle_info(:idle_timeout, state) do
    if state.status == :idle and state.messages == [] do
      Logger.info("AgentServer idle timeout for user #{state.user_id}")
      {:stop, :normal, state}
    else
      schedule_idle_timeout()
      {:noreply, state}
    end
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

  defp send_callback(state, message) do
    send(state.callback_pid, {:agent, message})
  end

  defp find_pending_tool(pending_tools, request_id) do
    Enum.find(pending_tools, &(&1.request_id == request_id))
  end

  defp process_message(server_pid, state) do
    # Build system prompt with document context
    system = build_system_prompt(state.current_document_id)

    # Call Anthropic API
    response = Anthropic.chat(
      state.messages,
      tools: Tools.definitions(),
      system: system
    )

    GenServer.cast(server_pid, {:api_response, response})
  end

  defp execute_tool(server_pid, state, tool_request) do
    # Build scope for the user
    scope = build_scope(state.user_id)

    result = Tools.execute(
      tool_request.tool_name,
      tool_request.tool_input,
      scope
    )

    GenServer.cast(server_pid, {:tool_executed, tool_request, result})
  end

  defp continue_with_rejection(server_pid, state) do
    # Messages already include the rejection tool_result, just call the API
    system = build_system_prompt(state.current_document_id)

    response = Anthropic.chat(
      state.messages,
      tools: Tools.definitions(),
      system: system
    )

    GenServer.cast(server_pid, {:api_response, response})
  end

  defp continue_after_tools(server_pid, state) do
    # Messages already include the tool_result, just call the API
    system = build_system_prompt(state.current_document_id)

    response = Anthropic.chat(
      state.messages,
      tools: Tools.definitions(),
      system: system
    )

    GenServer.cast(server_pid, {:api_response, response})
  end

  defp maybe_add_tool_error(result, true), do: Map.put(result, :is_error, true)
  defp maybe_add_tool_error(result, _), do: result

  defp build_system_prompt(nil) do
    """
    You are a helpful AI assistant integrated into Mindrian, a collaborative document platform.
    You can help users create, read, edit, and delete their documents.

    When using tools:
    - Always explain what you're about to do before using a tool
    - If a tool request is rejected, acknowledge it and suggest alternatives
    - Be concise but helpful in your responses
    """
  end

  defp build_system_prompt(document_id) do
    """
    You are a helpful AI assistant integrated into Mindrian, a collaborative document platform.
    You can help users create, read, edit, and delete their documents.

    The user is currently viewing document ID: #{document_id}
    You can reference this document in your responses and use tools to read or edit it.

    When using tools:
    - Always explain what you're about to do before using a tool
    - If a tool request is rejected, acknowledge it and suggest alternatives
    - Be concise but helpful in your responses
    """
  end

  defp build_scope(user_id) do
    user = Mindrian.Accounts.get_user!(user_id)
    %Scope{user: user}
  end

  defp build_assistant_message(content, tool_use) do
    # Build the content array for the assistant message
    content_blocks =
      if content != "" do
        [%{type: "text", text: content}]
      else
        []
      end

    tool_blocks =
      Enum.map(tool_use, fn tool ->
        %{
          type: "tool_use",
          id: tool.id,
          name: tool.name,
          input: tool.input
        }
      end)

    %{role: "assistant", content: content_blocks ++ tool_blocks}
  end
end
