defmodule Mindrian.Chat.Conversation do
  @moduledoc """
  Pure functional domain model for chat conversations.

  All functions return `{:ok, new_state, events}` or `{:error, reason}`.
  No side effects, no processes, no IO.

  ## Design Principles

  - **Pure**: Functions only depend on their inputs
  - **Serializable**: No PIDs, no closures, atoms only in known positions
  - **Event-sourced**: State transitions emit events for UI updates

  ## Conversation Status

  Three statuses: `:idle`, `:running`, `:awaiting_approval`

      :idle ─────────────────────► :running
              send_message/3

      :running ──────────────────► :awaiting_approval
              await_approval/1 (when pending tool calls exist)

      :awaiting_approval ────────► :running
              approve_tool_call/2, reject_tool_call/3

      :running ──────────────────► :idle
              complete_run/1

      :running | :awaiting_approval ──► :idle
              cancel/1

  ## Tool Call Lifecycle

  Tool calls have their own status independent of conversation status:

      :pending_approval ──► :approved ──► :executing ──► :completed
                                │              └───────► :failed
                                └──────────────────────► :cancelled
      :pending_approval ──► :rejected
      :pending_approval ──► :cancelled

  ## Function Categories

  **User actions**: `send_message/3`, `approve_tool_call/2`, `reject_tool_call/3`, `cancel/1`

  **Driver actions** (called by backend orchestration): `execute_approved_tool/2`,
  `complete_tool_call/3`, `fail_tool_call/3`, `next_approved_tool/1`

  **Agent actions** (called when LLM produces output): `start_agent_message/1`,
  `append_chunk/2`, `complete_agent_message/1`, `request_tool_call/5`,
  `request_approved_tool_call/5`, `await_approval/1`, `complete_run/1`

  **Queries**: `streaming?/1`

  **Utilities**: `set_error/2`, `to_map/1`
  """

  alias Mindrian.Accounts.Scope
  alias Mindrian.Chat.{Event, Message}

  @type status :: :idle | :running | :awaiting_approval

  @type t :: %__MODULE__{
          id: String.t(),
          scope: Scope.t() | nil,
          status: status(),
          messages: [Message.t()],
          pending_error: String.t() | nil
        }

  defstruct [:id, :scope, status: :idle, messages: [], pending_error: nil]

  @doc """
  Create a new conversation with the given ID and scope.
  """
  @spec new(String.t(), Scope.t()) :: t()
  def new(id, scope) do
    %__MODULE__{id: id, scope: scope}
  end

  # ---------------------------------------------------------------------------
  # User Actions
  # ---------------------------------------------------------------------------

  @doc """
  User sends a message. Only valid when idle.
  Transitions to :running and clears any pending error.

  ## Parameters

  - `conv` - The conversation state
  - `message_id` - Unique identifier for this message (client-generated for optimistic updates)
  - `content` - The message text
  """
  @spec send_message(t(), String.t(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def send_message(%{status: :idle} = conv, message_id, content) do
    message = Message.user(message_id, content)

    new_conv = %{
      conv
      | status: :running,
        messages: conv.messages ++ [message],
        pending_error: nil
    }

    events = [{:status_changed, :running}]
    {:ok, new_conv, events}
  end

  def send_message(%{status: status}, _message_id, _content) do
    {:error, {:not_your_turn, current: status, expected: :idle}}
  end

  @doc """
  User approves a tool call. Marks as :approved (not executing yet).
  If more tools are pending, stays :awaiting_approval.
  If no more pending, transitions to :running to begin execution phase.
  """
  @spec approve_tool_call(t(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def approve_tool_call(%{status: :awaiting_approval} = conv, tool_id) do
    case update_tool_call(conv.messages, tool_id, :pending_approval, fn tc ->
           %{tc | status: :approved}
         end) do
      {:ok, messages} ->
        {new_status, status_events} =
          if has_pending_approvals?(messages),
            do: {:awaiting_approval, []},
            else: {:running, [{:status_changed, :running}]}

        new_conv = %{conv | status: new_status, messages: messages}
        events = [{:tool_call_approved, tool_id}] ++ status_events
        {:ok, new_conv, events}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def approve_tool_call(%{status: status}, _tool_id) do
    {:error, {:invalid_status, current: status, expected: :awaiting_approval}}
  end

  @doc """
  User rejects a tool call with optional reason.
  Already-approved tools are unaffected and will execute.
  All pending tools after the rejected one are cascade-rejected.
  Transitions to :running.
  """
  @spec reject_tool_call(t(), String.t(), String.t() | nil) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def reject_tool_call(conv, tool_id, reason \\ nil)

  def reject_tool_call(%{status: :awaiting_approval} = conv, tool_id, reason) do
    # Find the tool and cascade reject all pending after it
    case cascade_reject(conv.messages, tool_id, reason) do
      {:ok, messages, reject_events} ->
        new_conv = %{conv | status: :running, messages: messages}
        events = reject_events ++ [{:status_changed, :running}]
        {:ok, new_conv, events}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def reject_tool_call(%{status: status}, _tool_id, _reason) do
    {:error, {:invalid_status, current: status, expected: :awaiting_approval}}
  end

  @doc """
  User cancels the current run. Valid when running or awaiting approval.
  Cancels any streaming agent message, pending approvals, and approved (not yet executed) tools.
  """
  @spec cancel(t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def cancel(%{status: status} = conv) when status in [:running, :awaiting_approval] do
    {messages, events} = cancel_pending_items(conv.messages)
    new_conv = %{conv | status: :idle, messages: messages}
    all_events = events ++ [{:status_changed, :idle}]
    {:ok, new_conv, all_events}
  end

  def cancel(%{status: status}) do
    {:error, {:invalid_status, current: status, expected: [:running, :awaiting_approval]}}
  end

  # ---------------------------------------------------------------------------
  # Agent Actions (called when LLM produces output)
  # ---------------------------------------------------------------------------

  @doc """
  Agent starts a new response. Only valid when running.
  Generates a message ID internally and returns it in the event.
  Fails if there's already a streaming message (must complete it first).
  """
  @spec start_agent_message(t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def start_agent_message(%{status: :running} = conv) do
    case find_streaming_message(conv.messages) do
      nil ->
        message_id = generate_id()
        message = Message.agent(message_id)
        new_conv = %{conv | messages: conv.messages ++ [message]}
        events = [{:agent_started, message_id}]
        {:ok, new_conv, events}

      %{id: existing_id} ->
        {:error, {:already_streaming, id: existing_id}}
    end
  end

  def start_agent_message(%{status: status}) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Agent appends a chunk to the current streaming message.
  Finds the streaming message automatically.
  """
  @spec append_chunk(t(), String.t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def append_chunk(%{status: :running} = conv, chunk) do
    case find_streaming_message(conv.messages) do
      nil ->
        {:error, :no_streaming_message}

      %{id: message_id} ->
        messages =
          Enum.map(conv.messages, fn
            %{id: ^message_id} = msg -> %{msg | content: msg.content <> chunk}
            msg -> msg
          end)

        new_conv = %{conv | messages: messages}
        events = [{:agent_chunk, message_id, chunk}]
        {:ok, new_conv, events}
    end
  end

  def append_chunk(%{status: status}, _chunk) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Marks the current streaming agent message as complete. Does NOT end the run.
  Use this when the agent finishes a text segment before a tool call.
  For ending the entire run, use `complete_run/1`.
  Finds the streaming message automatically.
  """
  @spec complete_agent_message(t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def complete_agent_message(%{status: :running} = conv) do
    case find_streaming_message(conv.messages) do
      nil ->
        {:error, :no_streaming_message}

      %{id: message_id} ->
        messages =
          Enum.map(conv.messages, fn
            %{id: ^message_id} = msg -> %{msg | status: :complete}
            msg -> msg
          end)

        new_conv = %{conv | messages: messages}
        events = [{:agent_complete, message_id}]
        {:ok, new_conv, events}
    end
  end

  def complete_agent_message(%{status: status}) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Completes the entire run. Marks any streaming agent message as complete
  and transitions to idle. Call this when the agent is truly done.
  """
  @spec complete_run(t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def complete_run(%{status: :running} = conv) do
    {messages, complete_events} = complete_streaming_message(conv.messages)
    new_conv = %{conv | status: :idle, messages: messages}
    events = complete_events ++ [{:status_changed, :idle}]
    {:ok, new_conv, events}
  end

  def complete_run(%{status: status}) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Agent requests a tool call. Stays :running so multiple tools can be queued.
  Auto-completes any streaming agent message (since tool calls come after text).
  Call `await_approval/1` when done queueing to transition to :awaiting_approval.
  """
  @spec request_tool_call(t(), String.t(), String.t(), map(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def request_tool_call(%{status: :running} = conv, id, name, arguments, description) do
    # Auto-complete any streaming message first
    {messages, complete_events} = complete_streaming_message(conv.messages)

    tool_call = Message.tool_call(id, name, arguments, description)
    new_conv = %{conv | messages: messages ++ [tool_call]}

    events = complete_events ++ [{:tool_call_requested, tool_call}]
    {:ok, new_conv, events}
  end

  def request_tool_call(%{status: status}, _id, _name, _arguments, _description) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Request a pre-approved tool call (e.g., Read for auto-approve policies).
  Skips :pending_approval, creates tool with :approved status.
  Auto-completes any streaming agent message.
  """
  @spec request_approved_tool_call(t(), String.t(), String.t(), map(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def request_approved_tool_call(%{status: :running} = conv, id, name, arguments, description) do
    {messages, complete_events} = complete_streaming_message(conv.messages)

    tool_call = %{Message.tool_call(id, name, arguments, description) | status: :approved}
    new_conv = %{conv | messages: messages ++ [tool_call]}

    events =
      complete_events ++
        [
          {:tool_call_requested, tool_call},
          {:tool_call_approved, id}
        ]

    {:ok, new_conv, events}
  end

  def request_approved_tool_call(%{status: status}, _id, _name, _arguments, _description) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Transitions to :awaiting_approval when the agent has queued tool calls.
  Call this when the agent signals it's paused for user input.
  """
  @spec await_approval(t()) :: {:ok, t(), [Event.t()]} | {:error, term()}
  def await_approval(%{status: :running} = conv) do
    if has_pending_approvals?(conv.messages) do
      new_conv = %{conv | status: :awaiting_approval}
      events = [{:status_changed, :awaiting_approval}]
      {:ok, new_conv, events}
    else
      {:error, :no_pending_approvals}
    end
  end

  def await_approval(%{status: status}) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  # ---------------------------------------------------------------------------
  # Driver Actions (called by backend orchestration)
  # ---------------------------------------------------------------------------

  @doc """
  Begin executing an approved tool. Only valid when running.
  Call `next_approved_tool/1` to find which tool to execute.
  """
  @spec execute_approved_tool(t(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def execute_approved_tool(%{status: :running} = conv, tool_id) do
    case update_tool_call(conv.messages, tool_id, :approved, fn tc ->
           %{tc | status: :executing}
         end) do
      {:ok, messages} ->
        new_conv = %{conv | messages: messages}
        events = [{:tool_call_executing, tool_id}]
        {:ok, new_conv, events}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def execute_approved_tool(%{status: status}, _tool_id) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Tool execution completed successfully. Stores the result.
  """
  @spec complete_tool_call(t(), String.t(), term()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def complete_tool_call(%{status: :running} = conv, tool_id, result) do
    case update_tool_call(conv.messages, tool_id, :executing, fn tc ->
           %{tc | status: :completed, result: result}
         end) do
      {:ok, messages} ->
        new_conv = %{conv | messages: messages}
        events = [{:tool_call_completed, tool_id}]
        {:ok, new_conv, events}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def complete_tool_call(%{status: status}, _tool_id, _result) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Tool execution failed. Stores the error message.
  """
  @spec fail_tool_call(t(), String.t(), String.t()) ::
          {:ok, t(), [Event.t()]} | {:error, term()}
  def fail_tool_call(%{status: :running} = conv, tool_id, error) do
    case update_tool_call(conv.messages, tool_id, :executing, fn tc ->
           %{tc | status: :failed, error: error}
         end) do
      {:ok, messages} ->
        new_conv = %{conv | messages: messages}
        events = [{:tool_call_failed, tool_id, error}]
        {:ok, new_conv, events}

      {:error, reason} ->
        {:error, reason}
    end
  end

  def fail_tool_call(%{status: status}, _tool_id, _error) do
    {:error, {:invalid_status, current: status, expected: :running}}
  end

  @doc """
  Returns the first approved tool that hasn't been executed yet.
  Backend uses this to know which tool to execute next.
  """
  @spec next_approved_tool(t()) :: Message.tool_call() | nil
  def next_approved_tool(%{messages: messages}) do
    Enum.find(messages, fn
      %{role: :tool_call, status: :approved} -> true
      _ -> false
    end)
  end

  @doc """
  Returns true if there's an agent message currently streaming.
  """
  @spec streaming?(t()) :: boolean()
  def streaming?(%{messages: messages}) do
    find_streaming_message(messages) != nil
  end

  @doc """
  Set a pending error for UI display. Does not change conversation status.
  """
  @spec set_error(t(), String.t()) :: {:ok, t(), [Event.t()]}
  def set_error(conv, message) do
    new_conv = %{conv | pending_error: message}
    events = [{:error, message}]
    {:ok, new_conv, events}
  end

  # ---------------------------------------------------------------------------
  # Serialization
  # ---------------------------------------------------------------------------

  @doc """
  Serialize conversation to a map suitable for JSON encoding.
  Converts atoms to strings for transport.
  """
  @spec to_map(t()) :: map()
  def to_map(%__MODULE__{} = conv) do
    %{
      id: conv.id,
      status: to_string(conv.status),
      messages: Enum.map(conv.messages, &message_to_map/1),
      pending_error: conv.pending_error
    }
  end

  defp message_to_map(%{role: :user} = msg) do
    %{id: msg.id, role: "user", content: msg.content}
  end

  defp message_to_map(%{role: :agent} = msg) do
    %{id: msg.id, role: "agent", content: msg.content, status: to_string(msg.status)}
  end

  defp message_to_map(%{role: :tool_call} = msg) do
    %{
      id: msg.id,
      role: "tool_call",
      name: msg.name,
      arguments: msg.arguments,
      description: msg.description,
      status: to_string(msg.status),
      result: msg.result,
      error: msg.error,
      rejection_reason: msg.rejection_reason
    }
  end

  # ---------------------------------------------------------------------------
  # Private Helpers
  # ---------------------------------------------------------------------------

  defp generate_id, do: Nanoid.generate()

  defp update_tool_call(messages, id, expected_status, update_fn) do
    case find_message(messages, id) do
      {:ok, %{role: :tool_call, status: ^expected_status}} ->
        updated =
          Enum.map(messages, fn
            %{id: ^id} = msg -> update_fn.(msg)
            msg -> msg
          end)

        {:ok, updated}

      {:ok, %{role: :tool_call, status: status}} ->
        {:error, {:invalid_tool_status, current: status, expected: expected_status}}

      {:ok, msg} ->
        {:error, {:invalid_message_role, current: msg.role, expected: :tool_call}}

      :not_found ->
        {:error, {:tool_call_not_found, id: id}}
    end
  end

  defp find_message(messages, id) do
    case Enum.find(messages, fn msg -> msg.id == id end) do
      nil -> :not_found
      msg -> {:ok, msg}
    end
  end

  defp find_streaming_message(messages) do
    Enum.find(messages, fn
      %{role: :agent, status: :streaming} -> true
      _ -> false
    end)
  end

  defp complete_streaming_message(messages) do
    {msgs, events} =
      Enum.reduce(messages, {[], []}, fn msg, {msgs, events} ->
        case msg do
          %{role: :agent, status: :streaming} = agent ->
            completed = %{agent | status: :complete}
            {[completed | msgs], [{:agent_complete, agent.id} | events]}

          other ->
            {[other | msgs], events}
        end
      end)

    {Enum.reverse(msgs), Enum.reverse(events)}
  end

  defp has_pending_approvals?(messages) do
    Enum.any?(messages, fn
      %{role: :tool_call, status: :pending_approval} -> true
      _ -> false
    end)
  end

  defp cascade_reject(messages, tool_id, reason) do
    # Find the tool, reject it and all subsequent pending tools
    case find_tool_index(messages, tool_id) do
      nil ->
        {:error, {:tool_call_not_found, id: tool_id}}

      index ->
        {msgs, events} =
          messages
          |> Enum.with_index()
          |> Enum.reduce({[], []}, fn {msg, i}, {msgs, events} ->
            cond do
              # The rejected tool itself
              i == index and msg.role == :tool_call and msg.status == :pending_approval ->
                rejected = %{msg | status: :rejected, rejection_reason: reason}
                {[rejected | msgs], [{:tool_call_rejected, msg.id} | events]}

              # Subsequent pending tools get cascade rejected
              i > index and msg.role == :tool_call and msg.status == :pending_approval ->
                rejected = %{
                  msg
                  | status: :rejected,
                    rejection_reason: "cascade: previous tool rejected"
                }

                {[rejected | msgs], [{:tool_call_rejected, msg.id} | events]}

              # Everything else unchanged
              true ->
                {[msg | msgs], events}
            end
          end)

        {:ok, Enum.reverse(msgs), Enum.reverse(events)}
    end
  end

  defp find_tool_index(messages, tool_id) do
    Enum.find_index(messages, fn
      %{role: :tool_call, id: ^tool_id} -> true
      _ -> false
    end)
  end

  defp cancel_pending_items(messages) do
    {msgs, events} =
      Enum.reduce(messages, {[], []}, fn msg, {msgs, events} ->
        case msg do
          %{role: :agent, status: :streaming} = agent ->
            cancelled = %{agent | status: :cancelled}
            {[cancelled | msgs], [{:agent_cancelled, agent.id} | events]}

          %{role: :tool_call, status: status} = tc
          when status in [:pending_approval, :approved] ->
            cancelled = %{tc | status: :cancelled}
            {[cancelled | msgs], [{:tool_call_cancelled, tc.id} | events]}

          other ->
            {[other | msgs], events}
        end
      end)

    {Enum.reverse(msgs), Enum.reverse(events)}
  end
end
