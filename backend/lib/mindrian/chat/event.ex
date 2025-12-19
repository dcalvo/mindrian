defmodule Mindrian.Chat.Event do
  @moduledoc """
  Events emitted during conversation state changes.

  Events are tuples returned by `Conversation` functions alongside the new state.
  The driver broadcasts these to the frontend over WebSocket.

  ## Event Categories

  - `{:status_changed, status}` - Conversation status changed
  - `{:agent_*}` - Agent message lifecycle (started, chunk, complete, cancelled)
  - `{:tool_call_*}` - Tool lifecycle (requested, approved, executing, completed, failed, rejected, cancelled)
  - `{:error, message}` - UI-only error (does not affect conversation state)

  ## Serialization

  Use `to_map/1` to convert events to JSON-compatible maps for transport.
  """

  alias Mindrian.Chat.Message

  @type t ::
          # Conversation status changes
          {:status_changed, :idle | :running | :awaiting_approval}

          # Agent message streaming
          | {:agent_started, message_id :: String.t()}
          | {:agent_chunk, message_id :: String.t(), chunk :: String.t()}
          | {:agent_complete, message_id :: String.t()}
          | {:agent_cancelled, message_id :: String.t()}

          # Tool call lifecycle
          | {:tool_call_requested, Message.tool_call()}
          | {:tool_call_approved, id :: String.t()}
          | {:tool_call_executing, id :: String.t()}
          | {:tool_call_completed, id :: String.t()}
          | {:tool_call_failed, id :: String.t(), error :: String.t()}
          | {:tool_call_rejected, id :: String.t()}
          | {:tool_call_cancelled, id :: String.t()}

          # Errors (UI-only, not part of conversation history)
          | {:error, message :: String.t()}

  @doc """
  Serialize an event to a map suitable for JSON encoding.
  """
  @spec to_map(t()) :: map()
  def to_map({:status_changed, status}) do
    %{type: "status_changed", status: to_string(status)}
  end

  def to_map({:agent_started, message_id}) do
    %{type: "agent_started", message_id: message_id}
  end

  def to_map({:agent_chunk, message_id, chunk}) do
    %{type: "agent_chunk", message_id: message_id, chunk: chunk}
  end

  def to_map({:agent_complete, message_id}) do
    %{type: "agent_complete", message_id: message_id}
  end

  def to_map({:agent_cancelled, message_id}) do
    %{type: "agent_cancelled", message_id: message_id}
  end

  def to_map({:tool_call_requested, tool_call}) do
    %{
      type: "tool_call_requested",
      id: tool_call.id,
      name: tool_call.name,
      arguments: tool_call.arguments,
      description: tool_call.description
    }
  end

  def to_map({:tool_call_approved, id}) do
    %{type: "tool_call_approved", id: id}
  end

  def to_map({:tool_call_executing, id}) do
    %{type: "tool_call_executing", id: id}
  end

  def to_map({:tool_call_completed, id}) do
    %{type: "tool_call_completed", id: id}
  end

  def to_map({:tool_call_failed, id, error}) do
    %{type: "tool_call_failed", id: id, error: error}
  end

  def to_map({:tool_call_rejected, id}) do
    %{type: "tool_call_rejected", id: id}
  end

  def to_map({:tool_call_cancelled, id}) do
    %{type: "tool_call_cancelled", id: id}
  end

  def to_map({:error, message}) do
    %{type: "error", message: message}
  end
end
