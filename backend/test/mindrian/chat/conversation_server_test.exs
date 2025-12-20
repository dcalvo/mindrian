defmodule Mindrian.Chat.ConversationServerTest do
  # Run tests synchronously to avoid Mox conflicts
  use ExUnit.Case, async: false

  import Mox

  alias Mindrian.Chat.ConversationServer
  alias Mindrian.Chat.MockDriver

  # Set Mox global mode for these tests since the GenServer
  # runs in a different process than the test
  setup :set_mox_global
  setup :verify_on_exit!

  setup do
    # Generate unique conversation ID for each test
    conversation_id = "conv-#{System.unique_integer([:positive])}"
    %{conversation_id: conversation_id}
  end

  describe "happy path: send -> text -> complete" do
    test "processes a simple text response", %{conversation_id: conv_id} do
      events = [
        {:text_chunk, "Hello"},
        {:text_chunk, " there!"},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)

      assert :ok = ConversationServer.send_message(pid, "Hi")

      # Wait for events to process
      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle
      assert length(conv.messages) == 2

      [user_msg, agent_msg] = conv.messages
      assert user_msg.role == :user
      assert user_msg.content == "Hi"
      assert agent_msg.role == :agent
      assert agent_msg.content == "Hello there!"
      assert agent_msg.status == :complete
    end
  end

  describe "auto-executed tool" do
    test "tool_started -> tool_completed -> text -> complete", %{conversation_id: conv_id} do
      events = [
        {:tool_started, "tool-1", "read_file", %{"path" => "/tmp/test.txt"}},
        {:tool_completed, "tool-1", %{content: "file contents"}},
        {:text_chunk, "The file contains: file contents"},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Read the file")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      # Should have: user message, tool call, agent message
      assert length(conv.messages) == 3

      tool_call = Enum.find(conv.messages, &(&1.role == :tool_call))
      assert tool_call.name == "read_file"
      assert tool_call.status == :completed
      assert tool_call.result == %{content: "file contents"}
    end

    test "tool_started -> tool_failed continues gracefully", %{conversation_id: conv_id} do
      events = [
        {:tool_started, "tool-1", "read_file", %{"path" => "/nonexistent"}},
        {:tool_failed, "tool-1", "File not found"},
        {:text_chunk, "Sorry, I couldn't read that file."},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Read it")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      tool_call = Enum.find(conv.messages, &(&1.role == :tool_call))
      assert tool_call.status == :failed
      assert tool_call.error == "File not found"
    end
  end

  describe "confirmation approved" do
    test "paused -> approve -> tool executes -> complete", %{conversation_id: conv_id} do
      run_events = [
        {:paused, "run-1",
         [
           %{
             id: "tool-1",
             name: "delete_file",
             args: %{"path" => "/important"},
             description: "Delete /important"
           }
         ]}
      ]

      continue_events = [
        :continued,
        {:tool_started, "tool-1", "delete_file", %{"path" => "/important"}},
        {:tool_completed, "tool-1", %{deleted: true}},
        {:text_chunk, "Done!"},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", run_events}
      end)

      expect(MockDriver, :continue, fn "run-1", tools ->
        assert length(tools) == 1
        [tool] = tools
        assert tool.tool_call_id == "tool-1"
        assert tool.confirmed == true
        {:ok, continue_events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Delete it")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :awaiting_approval

      # Approve the tool
      :ok = ConversationServer.approve_tool_call(pid, "tool-1")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      tool_call = Enum.find(conv.messages, &(&1.role == :tool_call))
      assert tool_call.status == :completed
    end
  end

  describe "confirmation rejected" do
    test "paused -> reject -> text continues -> complete", %{conversation_id: conv_id} do
      run_events = [
        {:paused, "run-1",
         [
           %{id: "tool-1", name: "delete_file", args: %{}, description: "Delete file"}
         ]}
      ]

      continue_events = [
        :continued,
        {:text_chunk, "Understood, I won't delete that."},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", run_events}
      end)

      expect(MockDriver, :continue, fn "run-1", tools ->
        assert length(tools) == 1
        [tool] = tools
        assert tool.tool_call_id == "tool-1"
        assert tool.confirmed == false
        {:ok, continue_events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Delete it")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :awaiting_approval

      :ok = ConversationServer.reject_tool_call(pid, "tool-1", "I changed my mind")

      # Wait for continue events to be processed
      :timer.sleep(50)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      tool_call = Enum.find(conv.messages, &(&1.role == :tool_call))
      assert tool_call.status == :rejected
      assert tool_call.rejection_reason == "I changed my mind"
    end
  end

  describe "partial approval" do
    test "approve A, reject B -> A executes, B/C/D cascade rejected", %{conversation_id: conv_id} do
      run_events = [
        {:paused, "run-1",
         [
           %{id: "tool-a", name: "op_a", args: %{}, description: "Operation A"},
           %{id: "tool-b", name: "op_b", args: %{}, description: "Operation B"},
           %{id: "tool-c", name: "op_c", args: %{}, description: "Operation C"},
           %{id: "tool-d", name: "op_d", args: %{}, description: "Operation D"}
         ]}
      ]

      continue_events = [
        :continued,
        {:tool_started, "tool-a", "op_a", %{}},
        {:tool_completed, "tool-a", %{done: true}},
        {:text_chunk, "Done with A, skipped B/C/D."},
        :text_end,
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", run_events}
      end)

      expect(MockDriver, :continue, fn "run-1", tools ->
        # Should have A approved, B/C/D rejected
        assert length(tools) == 4
        tool_a = Enum.find(tools, &(&1.tool_call_id == "tool-a"))
        tool_b = Enum.find(tools, &(&1.tool_call_id == "tool-b"))
        tool_c = Enum.find(tools, &(&1.tool_call_id == "tool-c"))
        tool_d = Enum.find(tools, &(&1.tool_call_id == "tool-d"))
        assert tool_a.confirmed == true
        assert tool_b.confirmed == false
        assert tool_c.confirmed == false
        assert tool_d.confirmed == false
        {:ok, continue_events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Do all the things")

      :timer.sleep(10)

      # Approve A
      :ok = ConversationServer.approve_tool_call(pid, "tool-a")

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :awaiting_approval

      # Reject B - should cascade to C and D
      :ok = ConversationServer.reject_tool_call(pid, "tool-b", "Don't do B")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      tool_a = Enum.find(conv.messages, &(&1.id == "tool-a"))
      tool_b = Enum.find(conv.messages, &(&1.id == "tool-b"))
      tool_c = Enum.find(conv.messages, &(&1.id == "tool-c"))
      tool_d = Enum.find(conv.messages, &(&1.id == "tool-d"))

      assert tool_a.status == :completed
      assert tool_b.status == :rejected
      assert tool_b.rejection_reason == "Don't do B"
      assert tool_c.status == :rejected
      assert tool_c.rejection_reason == "cascade: previous tool rejected"
      assert tool_d.status == :rejected
    end
  end

  describe "cancel" do
    test "cancel mid-stream", %{conversation_id: conv_id} do
      # Use a stream that yields slowly
      events =
        Stream.concat([
          [{:text_chunk, "Starting..."}],
          Stream.map(1..10, fn i ->
            Process.sleep(50)
            {:text_chunk, " chunk #{i}"}
          end),
          [:text_end, :complete]
        ])

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      expect(MockDriver, :cancel, fn "run-1" -> :ok end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Tell me a story")

      # Wait for first chunk then cancel
      :timer.sleep(20)
      :ok = ConversationServer.cancel(pid)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      # Agent message should be cancelled
      agent_msg = Enum.find(conv.messages, &(&1.role == :agent))
      assert agent_msg.status == :cancelled
    end

    test "cancel while paused", %{conversation_id: conv_id} do
      run_events = [
        {:paused, "run-1",
         [
           %{id: "tool-1", name: "dangerous_op", args: %{}, description: "Danger!"}
         ]}
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", run_events}
      end)

      expect(MockDriver, :cancel, fn "run-1" -> :ok end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Do something dangerous")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :awaiting_approval

      :ok = ConversationServer.cancel(pid)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle

      tool_call = Enum.find(conv.messages, &(&1.role == :tool_call))
      assert tool_call.status == :cancelled
    end
  end

  describe "error handling" do
    test "driver error sets conversation error", %{conversation_id: conv_id} do
      events = [
        {:text_chunk, "Starting..."},
        {:error, "Connection lost"}
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Hi")

      :timer.sleep(10)

      conv = ConversationServer.get_conversation(pid)
      assert conv.status == :idle
      assert conv.pending_error == "Connection lost"
    end

    test "task crash sets conversation error", %{conversation_id: conv_id} do
      # Stream that crashes mid-way
      events =
        Stream.concat([
          [{:text_chunk, "Starting..."}],
          Stream.map([1], fn _ -> raise "simulated crash" end)
        ])

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Hi")

      :timer.sleep(50)

      conv = ConversationServer.get_conversation(pid)
      assert conv.pending_error =~ "Driver crashed"
    end
  end

  describe "invalid operations" do
    test "send_message when not idle returns error", %{conversation_id: conv_id} do
      # Use a slow stream to keep running
      events =
        Stream.concat([
          [{:text_chunk, "Starting..."}],
          Stream.map(1..10, fn i ->
            Process.sleep(100)
            {:text_chunk, " #{i}"}
          end),
          [:text_end, :complete]
        ])

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "First")

      :timer.sleep(10)

      # Try to send another message while running
      assert {:error, {:not_your_turn, _}} = ConversationServer.send_message(pid, "Second")
    end

    test "approve when not awaiting returns error", %{conversation_id: conv_id} do
      events = [
        :complete
      ]

      expect(MockDriver, :run, fn _conv ->
        {:ok, "run-1", events}
      end)

      {:ok, pid} = start_server(conv_id)
      :ok = ConversationServer.send_message(pid, "Hi")

      :timer.sleep(10)

      assert {:error, {:invalid_status, _}} =
               ConversationServer.approve_tool_call(pid, "nonexistent")
    end
  end

  describe "whereis/1" do
    test "returns pid for existing server", %{conversation_id: conv_id} do
      {:ok, pid} = start_server(conv_id)

      assert {:ok, ^pid} = ConversationServer.whereis(conv_id)
    end

    test "returns error for non-existent server" do
      assert {:error, :not_found} = ConversationServer.whereis("nonexistent")
    end
  end

  # Helper to start a server with the mock driver
  defp start_server(conversation_id) do
    ConversationServer.start_link(
      conversation_id: conversation_id,
      driver: MockDriver
    )
  end
end
