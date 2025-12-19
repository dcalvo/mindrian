defmodule Mindrian.Chat.Message do
  @moduledoc """
  Message types for chat conversations.

  Messages are plain maps (not structs) representing entries in a conversation.
  All messages have an `id` and `role` field. Three roles exist:

  - `:user` - Text input from the user
  - `:agent` - Streaming or complete responses from the AI
  - `:tool_call` - Tool execution requests with approval workflow

  ## Agent Message Status

  `:streaming` → `:complete` | `:cancelled`

  ## Tool Call Status

  See `Conversation` moduledoc for the full tool call lifecycle.
  """

  @type user :: %{
          id: String.t(),
          role: :user,
          content: String.t()
        }

  @type agent_status :: :streaming | :complete | :cancelled

  @type agent :: %{
          id: String.t(),
          role: :agent,
          content: String.t(),
          status: agent_status()
        }

  @type tool_call_status ::
          :pending_approval
          | :approved
          | :executing
          | :completed
          | :failed
          | :rejected
          | :cancelled

  @type tool_call :: %{
          id: String.t(),
          role: :tool_call,
          name: String.t(),
          arguments: map(),
          description: String.t(),
          status: tool_call_status(),
          result: term() | nil,
          error: String.t() | nil,
          rejection_reason: String.t() | nil
        }

  @type t :: user() | agent() | tool_call()

  @doc "Create a new user message"
  @spec user(String.t(), String.t()) :: user()
  def user(id, content) do
    %{id: id, role: :user, content: content}
  end

  @doc "Create a new streaming agent message"
  @spec agent(String.t()) :: agent()
  def agent(id) do
    %{id: id, role: :agent, content: "", status: :streaming}
  end

  @doc "Create a new tool call awaiting approval"
  @spec tool_call(String.t(), String.t(), map(), String.t()) :: tool_call()
  def tool_call(id, name, arguments, description) do
    %{
      id: id,
      role: :tool_call,
      name: name,
      arguments: arguments,
      description: description,
      status: :pending_approval,
      result: nil,
      error: nil,
      rejection_reason: nil
    }
  end
end
