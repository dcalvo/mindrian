defmodule MindrianWeb.ChatChannelTest do
  use MindrianWeb.ChannelCase, async: false

  import Mox

  alias Mindrian.Chat.MockDriver
  alias MindrianWeb.ChatChannel

  setup :set_mox_global
  setup :verify_on_exit!

  setup do
    # Stub cancel for cleanup when tests end with running streams
    stub(MockDriver, :cancel, fn _ -> :ok end)

    user = user_fixture()
    token = Phoenix.Token.sign(@endpoint, "user socket", user.id)
    {:ok, socket} = connect(MindrianWeb.UserSocket, %{"token" => token})
    session_id = "session-#{System.unique_integer([:positive])}"
    %{socket: socket, user: user, session_id: session_id}
  end

  describe "join/3" do
    test "returns conversation state on join", %{socket: socket, session_id: session_id} do
      {:ok, reply, _socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      assert reply.id == session_id
      assert reply.status == :idle
      assert reply.messages == []
      assert reply.pending_error == nil
    end
  end

  describe "send_message" do
    test "triggers driver and returns ok", %{socket: socket, session_id: session_id} do
      events = [
        {:run_started, "run-1"},
        {:text_chunk, "Hello!"},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, events}
      end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      ref = push(socket, "send_message", %{"content" => "Hi"})
      assert_reply ref, :ok

      # Wait for events to process and be broadcast
      :timer.sleep(50)

      # Should receive status_changed event (running, then idle)
      assert_push "event", %{type: "status_changed", status: "running"}
    end

    test "returns error when not idle", %{socket: socket, session_id: session_id} do
      # Use a slow stream to keep running
      events =
        Stream.concat([
          [{:run_started, "run-1"}, {:text_chunk, "Starting..."}],
          Stream.map(1..10, fn i ->
            Process.sleep(100)
            {:text_chunk, " #{i}"}
          end),
          [:text_end, :complete]
        ])

      expect(MockDriver, :run, fn _conv ->
        {:ok, events}
      end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      # First message starts the run
      ref1 = push(socket, "send_message", %{"content" => "First"})
      assert_reply ref1, :ok

      :timer.sleep(20)

      # Second message should fail
      ref2 = push(socket, "send_message", %{"content" => "Second"})
      assert_reply ref2, :error, %{code: "not_your_turn"}
    end
  end

  describe "approve_tool_call" do
    test "approves tool and continues run", %{socket: socket, session_id: session_id} do
      run_events = [
        {:run_started, "run-1"},
        {:paused, "run-1",
         [
           %{id: "tool-1", name: "delete_file", args: %{}, description: "Delete file"}
         ]}
      ]

      continue_events = [
        :continued,
        {:tool_started, "tool-1", "delete_file", %{}},
        {:tool_completed, "tool-1", %{deleted: true}},
        {:text_chunk, "Done!"},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, run_events}
      end)

      expect(MockDriver, :continue, fn "run-1", tools ->
        assert length(tools) == 1
        [tool] = tools
        assert tool.confirmed == true
        {:ok, continue_events}
      end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      ref = push(socket, "send_message", %{"content" => "Delete it"})
      assert_reply ref, :ok

      :timer.sleep(20)

      ref = push(socket, "approve_tool_call", %{"tool_id" => "tool-1"})
      assert_reply ref, :ok
    end

    test "returns error when not awaiting approval", %{socket: socket, session_id: session_id} do
      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      ref = push(socket, "approve_tool_call", %{"tool_id" => "nonexistent"})
      assert_reply ref, :error, %{code: "invalid_status"}
    end
  end

  describe "reject_tool_call" do
    test "rejects tool with reason", %{socket: socket, session_id: session_id} do
      run_events = [
        {:run_started, "run-1"},
        {:paused, "run-1",
         [
           %{id: "tool-1", name: "dangerous_op", args: %{}, description: "Danger!"}
         ]}
      ]

      continue_events = [
        :continued,
        {:text_chunk, "Understood, I won't do that."},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, run_events}
      end)

      expect(MockDriver, :continue, fn "run-1", tools ->
        assert length(tools) == 1
        [tool] = tools
        assert tool.confirmed == false
        {:ok, continue_events}
      end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      ref = push(socket, "send_message", %{"content" => "Do something dangerous"})
      assert_reply ref, :ok

      :timer.sleep(20)

      ref = push(socket, "reject_tool_call", %{"tool_id" => "tool-1", "reason" => "Too risky"})
      assert_reply ref, :ok
    end
  end

  describe "cancel" do
    test "cancels running operation", %{socket: socket, session_id: session_id} do
      events =
        Stream.concat([
          [{:run_started, "run-1"}, {:text_chunk, "Starting..."}],
          Stream.map(1..10, fn i ->
            Process.sleep(50)
            {:text_chunk, " chunk #{i}"}
          end),
          [:text_end, :complete]
        ])

      expect(MockDriver, :run, fn _conv ->
        {:ok, events}
      end)

      expect(MockDriver, :cancel, fn "run-1" -> :ok end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      ref = push(socket, "send_message", %{"content" => "Tell me a story"})
      assert_reply ref, :ok

      :timer.sleep(30)

      ref = push(socket, "cancel", %{})
      assert_reply ref, :ok
    end
  end

  describe "lifecycle" do
    test "server dies when channel terminates", %{socket: socket, session_id: session_id} do
      stub(MockDriver, :run, fn _conv -> {:ok, [:complete]} end)

      {:ok, _reply, socket} = subscribe_and_join(socket, ChatChannel, "chat:#{session_id}")

      server_pid = socket.assigns.server
      assert Process.alive?(server_pid)

      Process.unlink(socket.channel_pid)
      Process.exit(socket.channel_pid, :kill)

      :timer.sleep(10)
      refute Process.alive?(server_pid)
    end
  end
end
