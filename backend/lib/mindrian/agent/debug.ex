defmodule Mindrian.Agent.Debug do
  @moduledoc """
  Debug event broadcasting for agent message flow.

  In development, broadcasts detailed events to a PubSub topic that can be
  consumed by a debug channel for frontend visibility.

  Events are no-ops in production to avoid overhead.
  """

  require Logger

  @topic "agent:debug"

  @doc """
  Returns the debug PubSub topic.
  """
  def topic, do: @topic

  @doc """
  Broadcasts a debug event. No-op in production.
  """
  if Mix.env() == :prod do
    def emit(_event, _metadata), do: :ok
  else
    def emit(event, metadata \\ %{}) do
      payload = %{
        event: event,
        timestamp: System.system_time(:millisecond),
        metadata: metadata
      }

      Logger.debug("[Agent.Debug] #{event}: #{inspect(metadata)}")
      Phoenix.PubSub.broadcast(Mindrian.PubSub, @topic, {:agent_debug, payload})
    end
  end

  # Convenience functions for common events

  def message_received(user_id, session_id, content) do
    emit(:message_received, %{
      user_id: user_id,
      session_id: session_id,
      content_preview: String.slice(content, 0..100)
    })
  end

  def status_changed(user_id, session_id, from, to) do
    emit(:status_changed, %{
      user_id: user_id,
      session_id: session_id,
      from: from,
      to: to
    })
  end

  def task_started(user_id, session_id, task_type) do
    emit(:task_started, %{
      user_id: user_id,
      session_id: session_id,
      task_type: task_type
    })
  end

  def task_completed(user_id, session_id, task_type) do
    emit(:task_completed, %{
      user_id: user_id,
      session_id: session_id,
      task_type: task_type
    })
  end

  def task_crashed(user_id, session_id, reason) do
    emit(:task_crashed, %{
      user_id: user_id,
      session_id: session_id,
      reason: inspect(reason)
    })
  end

  def api_request(user_id, session_id, message_count, has_tools) do
    emit(:api_request, %{
      user_id: user_id,
      session_id: session_id,
      message_count: message_count,
      has_tools: has_tools
    })
  end

  def api_response(user_id, session_id, stop_reason, tool_count) do
    emit(:api_response, %{
      user_id: user_id,
      session_id: session_id,
      stop_reason: stop_reason,
      tool_count: tool_count
    })
  end

  def tool_requested(user_id, session_id, tool_name, request_id) do
    emit(:tool_requested, %{
      user_id: user_id,
      session_id: session_id,
      tool_name: tool_name,
      request_id: request_id
    })
  end

  def tool_approved(user_id, session_id, tool_name, request_id) do
    emit(:tool_approved, %{
      user_id: user_id,
      session_id: session_id,
      tool_name: tool_name,
      request_id: request_id
    })
  end

  def tool_rejected(user_id, session_id, tool_name, request_id) do
    emit(:tool_rejected, %{
      user_id: user_id,
      session_id: session_id,
      tool_name: tool_name,
      request_id: request_id
    })
  end

  def tool_executed(user_id, session_id, tool_name, success) do
    emit(:tool_executed, %{
      user_id: user_id,
      session_id: session_id,
      tool_name: tool_name,
      success: success
    })
  end

  def pubsub_broadcast(user_id, session_id, event_type) do
    emit(:pubsub_broadcast, %{
      user_id: user_id,
      session_id: session_id,
      event_type: event_type
    })
  end

  def session_started(user_id, session_id) do
    emit(:session_started, %{
      user_id: user_id,
      session_id: session_id
    })
  end

  def session_timeout(user_id, session_id) do
    emit(:session_timeout, %{
      user_id: user_id,
      session_id: session_id
    })
  end

  def cancelled(user_id, session_id) do
    emit(:cancelled, %{
      user_id: user_id,
      session_id: session_id
    })
  end
end
