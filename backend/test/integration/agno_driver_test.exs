defmodule Mindrian.Chat.Drivers.AgnoDriverIntegrationTest do
  @moduledoc """
  Integration tests for AgnoDriver against a running Agno server.

  Run with: mix test test/integration --include integration
  Requires: Agno running on localhost:8000
  """
  use ExUnit.Case, async: false

  @moduletag :integration

  require Logger

  alias Mindrian.Accounts.{Scope, User}
  alias Mindrian.Chat.{Conversation, Drivers.AgnoDriver}

  @timeout 60_000

  setup do
    # Enable info-level logging for integration tests
    previous_level = Logger.level()
    Logger.configure(level: :info)
    on_exit(fn -> Logger.configure(level: previous_level) end)

    # Create a test user and scope
    user = %User{id: Ecto.UUID.generate(), email: "integration-test@example.com"}
    session_id = "integration-#{System.unique_integer([:positive])}"
    scope = Scope.for_chat(user, session_id)

    # Create a conversation with a user message
    conv =
      Conversation.new(session_id, scope)
      |> add_user_message("Hello, this is an integration test.")

    %{conv: conv, session_id: session_id}
  end

  describe "run/1" do
    @tag timeout: @timeout
    test "streams events for a simple message", %{conv: conv} do
      {:ok, stream} = AgnoDriver.run(conv)

      events = Enum.take(stream, 20)

      # Should have run_started as first event
      assert [{:run_started, run_id} | _rest] = events
      assert is_binary(run_id)

      # Should have some text chunks
      text_chunks = Enum.filter(events, &match?({:text_chunk, _}, &1))
      assert length(text_chunks) > 0

      # Should end with :complete or have more events
      event_types = Enum.map(events, &event_type/1)
      assert :run_started in event_types
    end

    @tag timeout: @timeout
    test "streams tool execution events with ping tool", %{session_id: session_id} do
      # Create a conversation that triggers the ping tool
      # Requires agent running with MINDRIAN_TESTING=true
      user = %User{id: Ecto.UUID.generate(), email: "tool-test@example.com"}
      scope = Scope.for_chat(user, session_id <> "-tool")

      conv =
        Conversation.new(session_id <> "-tool", scope)
        |> add_user_message(
          "Please use the ping tool with the message 'hello from integration test'"
        )

      {:ok, stream} = AgnoDriver.run(conv)

      # Consume all events until complete or error
      events = Enum.to_list(stream)

      event_types = Enum.map(events, &event_type/1)
      Logger.info("Tool test received event types: #{inspect(event_types)}")

      assert :run_started in event_types
      # Should pause for approval since ping requires confirmation
      assert :paused in event_types, "Expected :paused event for tool confirmation"
    end

    @tag timeout: @timeout
    test "continues run after tool approval", %{session_id: session_id} do
      # Create a conversation that triggers the ping tool
      # Requires agent running with MINDRIAN_TESTING=true
      user = %User{id: Ecto.UUID.generate(), email: "tool-test@example.com"}
      scope = Scope.for_chat(user, session_id <> "-continue")

      conv =
        Conversation.new(session_id <> "-continue", scope)
        |> add_user_message("Please use the ping tool with message 'test approval flow'")

      {:ok, stream} = AgnoDriver.run(conv)

      # Consume events until we get paused
      events = Enum.to_list(stream)
      event_types = Enum.map(events, &event_type/1)
      Logger.info("Initial run event types: #{inspect(event_types)}")

      # Find the paused event to get run_id and tool info
      {:paused, run_id, tools} = Enum.find(events, &match?({:paused, _, _}, &1))
      assert length(tools) == 1
      [tool] = tools
      assert tool.name == "ping"

      Logger.info("Approving tool: #{tool.name} (id=#{tool.id})")

      # Continue with approval
      tool_decision = %{
        tool_call_id: tool.id,
        tool_name: tool.name,
        tool_args: tool.args,
        confirmed: true
      }

      {:ok, continue_stream} = AgnoDriver.continue(run_id, scope, [tool_decision])
      continue_events = Enum.to_list(continue_stream)
      continue_event_types = Enum.map(continue_events, &event_type/1)
      Logger.info("Continue event types: #{inspect(continue_event_types)}")

      # Should see continued, tool execution, and complete
      assert :continued in continue_event_types or :tool_started in continue_event_types
      assert :complete in continue_event_types
    end
  end

  describe "cancel/1" do
    test "returns ok for non-existent run_id" do
      # Agno returns 500 for invalid runs, which we treat as success
      assert :ok = AgnoDriver.cancel("not-a-real-run-id")
    end
  end

  # Helpers

  defp add_user_message(conv, content) do
    # Messages are plain maps, not structs
    message = %{
      id: Nanoid.generate(),
      role: :user,
      content: content
    }

    %{conv | messages: conv.messages ++ [message]}
  end

  defp event_type({:run_started, _}), do: :run_started
  defp event_type({:text_chunk, _}), do: :text_chunk
  defp event_type(:text_end), do: :text_end
  defp event_type({:tool_started, _, _, _}), do: :tool_started
  defp event_type({:tool_completed, _, _}), do: :tool_completed
  defp event_type({:tool_failed, _, _}), do: :tool_failed
  defp event_type({:paused, _, _}), do: :paused
  defp event_type(:continued), do: :continued
  defp event_type(:complete), do: :complete
  defp event_type({:error, _}), do: :error
  defp event_type(other), do: other
end
