defmodule Mindrian.Agent do
  @moduledoc """
  Context for AI agent operations.

  This module provides the public API for interacting with AI agent sessions.
  Each user can have multiple agent sessions, identified by a session_id.
  The agent can read and modify the user's documents using tools that require
  user approval before execution.
  """

  alias Mindrian.Agent.{AgentServer, Tools}

  @doc """
  Starts or retrieves an existing agent session for a user.

  Returns the PubSub topic that should be subscribed to for receiving
  agent messages (status updates, tool requests, etc.).

  ## Returns
    - `{:ok, topic}` on success where topic is the PubSub topic string
    - `{:error, reason}` on failure
  """
  def start_session(user_id, session_id) do
    case AgentServer.get_or_start(user_id, session_id) do
      {:ok, _pid} -> {:ok, AgentServer.topic(user_id, session_id)}
      {:error, reason} -> {:error, reason}
    end
  end

  @doc """
  Returns the PubSub topic for an agent session.

  Callers should subscribe to this topic to receive agent messages:
  - `{:agent, {:status, status}}` - Status changes
  - `{:agent, {:assistant_message, content}}` - Assistant responses
  - `{:agent, {:tool_request, tool}}` - Tool approval requests
  - `{:agent, {:tool_result, request_id, success, result}}` - Tool execution results
  - `{:agent, {:error, message}}` - Error messages
  """
  def session_topic(user_id, session_id) do
    AgentServer.topic(user_id, session_id)
  end

  @doc """
  Sends a user message to the agent.

  The agent will process the message and may request tool usage.
  Responses are delivered via PubSub to the session topic.

  ## Options
    - `:document_id` - The ID of the currently open document (for context)

  ## Returns
    - `:ok` if message was accepted
    - `{:error, :busy}` if agent is currently processing
    - `{:error, :not_found}` if session doesn't exist
  """
  def send_message(user_id, session_id, content, opts \\ []) do
    context = %{document_id: opts[:document_id]}
    AgentServer.send_message(user_id, session_id, content, context)
  end

  @doc """
  Responds to a pending tool request.

  When the agent requests to use a tool, the user must approve or reject it.

  ## Returns
    - `:ok` if response was accepted
    - `{:error, :not_found}` if request doesn't exist or session doesn't exist
  """
  def respond_to_tool(user_id, session_id, request_id, approved) when is_boolean(approved) do
    AgentServer.respond_to_tool(user_id, session_id, request_id, approved)
  end

  @doc """
  Cancels the current agent operation.

  This will clear any pending tool requests and reset the agent to idle state.
  """
  def cancel(user_id, session_id) do
    AgentServer.cancel(user_id, session_id)
  end

  @doc """
  Returns the list of available tool definitions.

  These are the tools the agent can use to interact with the user's documents.
  """
  def available_tools do
    Tools.definitions()
  end
end
