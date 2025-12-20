defmodule Mindrian.Chat.Driver do
  @moduledoc """
  Behaviour for conversation drivers.

  A driver connects the ConversationServer to an external AI agent (Agno, mock, etc.).
  The driver returns an enumerable of events that the server consumes in a Task.

  ## Event Types

  Events yielded from the enumerable:

  - `{:run_started, run_id}` - Run started (first event, provides run_id for cancel)
  - `{:text_chunk, content}` - Text content chunk (driver should filter empty chunks)
  - `:text_end` - Text segment complete
  - `{:tool_started, id, name, args}` - Auto-approved tool execution started
  - `{:tool_completed, id, result}` - Tool execution succeeded
  - `{:tool_failed, id, error}` - Tool execution failed
  - `{:paused, run_id, tools}` - Run paused awaiting approval
  - `:continued` - Run continued after approval
  - `:complete` - Run completed
  - `{:error, reason}` - Run failed with error

  ## Tool Map Structure

  Tools in `{:paused, run_id, tools}` are maps with:
  - `id` - Tool call ID
  - `name` - Tool name
  - `args` - Tool arguments
  - `description` - Human-readable description
  """

  alias Mindrian.Chat.Conversation

  @type event ::
          {:run_started, run_id :: String.t()}
          | {:text_chunk, content :: String.t()}
          | :text_end
          | {:tool_started, id :: String.t(), name :: String.t(), args :: map()}
          | {:tool_completed, id :: String.t(), result :: term()}
          | {:tool_failed, id :: String.t(), error :: String.t()}
          | {:paused, run_id :: String.t(), tools :: [tool_info()]}
          | :continued
          | :complete
          | {:error, reason :: String.t()}

  @type tool_info :: %{
          id: String.t(),
          name: String.t(),
          args: map(),
          description: String.t()
        }

  @type tool_decision :: %{
          tool_call_id: String.t(),
          tool_name: String.t(),
          tool_args: map(),
          confirmed: boolean()
        }

  @doc """
  Start a new run for the conversation.

  Returns `{:ok, enumerable}` where the enumerable yields events.
  The first event must be `{:run_started, run_id}` which provides
  the run identifier needed for continue/cancel operations.
  """
  @callback run(conversation :: Conversation.t()) ::
              {:ok, Enumerable.t(event())}

  @doc """
  Continue a paused run after user approval/rejection decisions.

  `scope` provides user and session context for the continuation.
  `tools` is a list of tool decisions with `confirmed: true | false`.
  Approved tools (confirmed: true) will be executed.
  Rejected tools (confirmed: false) will be skipped.

  Returns `{:ok, enumerable}` that yields events as the continuation progresses.
  """
  @callback continue(
              run_id :: String.t(),
              scope :: Mindrian.Accounts.Scope.t(),
              tools :: [tool_decision()]
            ) ::
              {:ok, Enumerable.t(event())}

  @doc """
  Cancel an in-progress run.

  Best-effort cancellation - the run may have already completed.
  Returns `:ok` on success, `{:error, reason}` on failure.
  """
  @callback cancel(run_id :: String.t()) :: :ok | {:error, term()}
end
