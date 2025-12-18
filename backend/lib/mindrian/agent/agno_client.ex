defmodule Mindrian.Agent.AgnoClient do
  @moduledoc """
  Thin HTTP client for the Agno AgentOS Python microservice.

  Returns async responses that stream SSE chunks to the calling process.
  The caller is responsible for handling SSE messages via `Req.parse_message/2`.

  ## Usage

      {:ok, resp} = AgnoClient.start_run("Hello", user_id: 1, session_id: "abc")
      # SSE chunks arrive as messages to calling process
      # Use Req.parse_message(resp, message) in handle_info

  """
  require Logger

  @agent_id "mindrian-agent"
  @request_timeout 300_000

  defp agno_url do
    Application.get_env(:mindrian, :agno_url, "http://localhost:8000")
  end

  @doc """
  Start an agent run with streaming response.

  Returns `{:ok, response}` where `response.body` is a `Req.Response.Async`.
  SSE chunks will be sent as messages to the calling process.

  ## Options

    * `:user_id` - (required) User ID for authentication
    * `:session_id` - (required) Session ID for conversation context
    * `:document_id` - (optional) Current document ID for context

  """
  @spec start_run(String.t(), keyword()) :: {:ok, Req.Response.t()} | {:error, term()}
  def start_run(message, opts) do
    user_id = Keyword.fetch!(opts, :user_id)
    session_id = Keyword.fetch!(opts, :session_id)
    document_id = Keyword.get(opts, :document_id)

    # Dependencies passed to Agno for tool context
    dependencies = Jason.encode!(%{document_id: document_id})

    form_data = [
      {"message", message},
      {"stream", "true"},
      {"session_id", session_id},
      {"user_id", to_string(user_id)},
      {"dependencies", dependencies}
    ]

    url = "#{agno_url()}/agents/#{@agent_id}/runs"

    Req.post(url,
      form: form_data,
      headers: [{"accept", "text/event-stream"}],
      receive_timeout: @request_timeout,
      into: :self
    )
  end

  @doc """
  Continue an agent run after tool confirmation.

  Returns `{:ok, response}` where `response.body` is a `Req.Response.Async`.
  Agno will execute the tool via HTTP callback to Phoenix.

  ## Options

    * `:user_id` - (required) User ID for authentication
    * `:session_id` - (required) Session ID
    * `:tool_call_id` - (required) The ID of the tool call being responded to
    * `:tool_name` - (required) The name of the tool
    * `:tool_args` - (required) The arguments for the tool
    * `:approved` - (required) Whether the tool was approved

  """
  @spec continue_run(String.t(), keyword()) :: {:ok, Req.Response.t()} | {:error, term()}
  def continue_run(run_id, opts) do
    user_id = Keyword.fetch!(opts, :user_id)
    session_id = Keyword.fetch!(opts, :session_id)
    tool_call_id = Keyword.fetch!(opts, :tool_call_id)
    tool_name = Keyword.fetch!(opts, :tool_name)
    tool_args = Keyword.fetch!(opts, :tool_args)
    approved = Keyword.fetch!(opts, :approved)

    tool_execution =
      if approved do
        %{
          tool_call_id: tool_call_id,
          tool_name: tool_name,
          tool_args: tool_args,
          requires_confirmation: true,
          confirmed: true
        }
      else
        %{
          tool_call_id: tool_call_id,
          tool_name: tool_name,
          tool_args: tool_args,
          requires_confirmation: true,
          confirmed: false,
          confirmation_note: "User rejected the tool execution"
        }
      end

    form_data = [
      {"tools", Jason.encode!([tool_execution])},
      {"session_id", session_id},
      {"user_id", to_string(user_id)},
      {"stream", "true"}
    ]

    url = "#{agno_url()}/agents/#{@agent_id}/runs/#{run_id}/continue"

    Req.post(url,
      form: form_data,
      headers: [{"accept", "text/event-stream"}],
      receive_timeout: @request_timeout,
      into: :self
    )
  end

  @doc """
  Cancel an in-progress agent run.
  """
  @spec cancel(String.t()) :: {:ok, Req.Response.t()} | {:error, term()}
  def cancel(run_id) do
    url = "#{agno_url()}/agents/#{@agent_id}/runs/#{run_id}/cancel"
    Req.post(url, form: [], receive_timeout: 5_000)
  end
end
