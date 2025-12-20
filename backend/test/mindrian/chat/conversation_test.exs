defmodule Mindrian.Chat.ConversationTest do
  use ExUnit.Case, async: true

  alias Mindrian.Chat.Conversation

  describe "new/1" do
    test "creates an idle conversation with no messages" do
      conv = Conversation.new("conv-1")

      assert conv.id == "conv-1"
      assert conv.status == :idle
      assert conv.messages == []
      assert conv.pending_error == nil
    end
  end

  describe "send_message/3" do
    test "transitions from idle to running" do
      conv = Conversation.new("conv-1")

      assert {:ok, new_conv, events} = Conversation.send_message(conv, "msg-1", "Hello")

      assert new_conv.status == :running
      assert [%{id: "msg-1", role: :user, content: "Hello"}] = new_conv.messages
      assert new_conv.pending_error == nil
      assert events == [{:status_changed, :running}]
    end

    test "clears pending_error on new message" do
      conv = %{Conversation.new("conv-1") | pending_error: "Previous error"}

      assert {:ok, new_conv, _events} = Conversation.send_message(conv, "msg-1", "Hello")

      assert new_conv.pending_error == nil
    end

    test "rejects when not idle" do
      conv = %{Conversation.new("conv-1") | status: :running}

      assert {:error, {:not_your_turn, current: :running, expected: :idle}} =
               Conversation.send_message(conv, "msg-1", "Hello")
    end

    test "rejects when awaiting approval" do
      conv = %{Conversation.new("conv-1") | status: :awaiting_approval}

      assert {:error, {:not_your_turn, current: :awaiting_approval, expected: :idle}} =
               Conversation.send_message(conv, "msg-1", "Hello")
    end
  end

  describe "start_agent_message/1" do
    test "adds a streaming agent message with generated ID" do
      conv = %{Conversation.new("conv-1") | status: :running}

      assert {:ok, new_conv, events} = Conversation.start_agent_message(conv)

      assert [%{id: message_id, role: :agent, content: "", status: :streaming}] =
               new_conv.messages

      assert is_binary(message_id)
      assert events == [{:agent_started, message_id}]
    end

    test "rejects when idle" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: :running}} =
               Conversation.start_agent_message(conv)
    end

    test "rejects when already streaming" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [%{id: "agent-1", role: :agent, content: "Hi", status: :streaming}])

      assert {:error, {:already_streaming, id: "agent-1"}} =
               Conversation.start_agent_message(conv)
    end
  end

  describe "append_chunk/2" do
    test "appends content to streaming message" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "agent-1", role: :agent, content: "Hello", status: :streaming}
        ])

      assert {:ok, new_conv, events} = Conversation.append_chunk(conv, " world")

      assert [%{content: "Hello world"}] = new_conv.messages
      assert events == [{:agent_chunk, "agent-1", " world"}]
    end

    test "rejects when no streaming message" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [])

      assert {:error, :no_streaming_message} = Conversation.append_chunk(conv, " world")
    end

    test "rejects when message is not streaming" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [%{id: "agent-1", role: :agent, content: "Done", status: :complete}])

      assert {:error, :no_streaming_message} = Conversation.append_chunk(conv, " more")
    end
  end

  describe "complete_agent_message/1" do
    test "transitions streaming message to complete, stays running" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "agent-1", role: :agent, content: "Response", status: :streaming}
        ])

      assert {:ok, new_conv, events} = Conversation.complete_agent_message(conv)

      # Stays running - use complete_run to transition to idle
      assert new_conv.status == :running
      assert [%{status: :complete}] = new_conv.messages
      assert events == [{:agent_complete, "agent-1"}]
    end

    test "rejects when no streaming message" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [])

      assert {:error, :no_streaming_message} = Conversation.complete_agent_message(conv)
    end
  end

  describe "complete_run/1" do
    test "finalizes any streaming message and transitions to idle" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "agent-1", role: :agent, content: "Done", status: :streaming}
        ])

      assert {:ok, new_conv, events} = Conversation.complete_run(conv)

      assert new_conv.status == :idle
      assert [%{status: :complete}] = new_conv.messages

      assert events == [
               {:agent_complete, "agent-1"},
               {:status_changed, :idle}
             ]
    end

    test "transitions to idle even without streaming message" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [%{id: "agent-1", role: :agent, content: "Done", status: :complete}])

      assert {:ok, new_conv, events} = Conversation.complete_run(conv)

      assert new_conv.status == :idle
      assert events == [{:status_changed, :idle}]
    end

    test "rejects when not running" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: :running}} =
               Conversation.complete_run(conv)
    end
  end

  describe "request_tool_call/5" do
    test "adds tool call and stays running" do
      conv = %{Conversation.new("conv-1") | status: :running}

      assert {:ok, new_conv, events} =
               Conversation.request_tool_call(
                 conv,
                 "tool-1",
                 "create_document",
                 %{"name" => "Sea Shanty"},
                 "Create a new document called 'Sea Shanty'"
               )

      # Stays running to allow queueing more tools
      assert new_conv.status == :running

      assert [
               %{
                 id: "tool-1",
                 role: :tool_call,
                 name: "create_document",
                 arguments: %{"name" => "Sea Shanty"},
                 description: "Create a new document called 'Sea Shanty'",
                 status: :pending_approval
               }
             ] = new_conv.messages

      # No status_changed event - stays running
      assert [{:tool_call_requested, %{id: "tool-1"}}] = events
    end

    test "auto-completes streaming message before adding tool call" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "agent-1", role: :agent, content: "Let me do that", status: :streaming}
        ])

      assert {:ok, new_conv, events} =
               Conversation.request_tool_call(conv, "tool-1", "create_doc", %{}, "Create doc")

      # Agent message should be completed
      assert [
               %{role: :agent, status: :complete},
               %{role: :tool_call, status: :pending_approval}
             ] = new_conv.messages

      # Should emit agent_complete before tool_call_requested
      assert events == [
               {:agent_complete, "agent-1"},
               {:tool_call_requested,
                %{
                  id: "tool-1",
                  role: :tool_call,
                  name: "create_doc",
                  arguments: %{},
                  description: "Create doc",
                  status: :pending_approval,
                  result: nil,
                  error: nil,
                  rejection_reason: nil
                }}
             ]
    end

    test "can queue multiple tool calls" do
      conv = %{Conversation.new("conv-1") | status: :running}

      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-1", "op1", %{}, "First op")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-2", "op2", %{}, "Second op")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-3", "op3", %{}, "Third op")

      assert conv.status == :running
      assert length(conv.messages) == 3
      assert Enum.all?(conv.messages, &(&1.status == :pending_approval))
    end

    test "rejects when not running" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: :running}} =
               Conversation.request_tool_call(conv, "tool-1", "create_document", %{}, "desc")
    end
  end

  describe "request_approved_tool_call/5" do
    test "creates tool call with :approved status" do
      conv = %{Conversation.new("conv-1") | status: :running}

      assert {:ok, new_conv, events} =
               Conversation.request_approved_tool_call(
                 conv,
                 "tool-1",
                 "Read",
                 %{"path" => "f.ex"},
                 "Read f.ex"
               )

      assert [%{id: "tool-1", role: :tool_call, name: "Read", status: :approved}] =
               new_conv.messages

      assert events == [{:tool_call_approved, "tool-1"}]
    end

    test "auto-approved tools don't block await_approval" do
      conv = %{Conversation.new("conv-1") | status: :running}

      {:ok, conv, _} =
        Conversation.request_approved_tool_call(conv, "tool-1", "Read", %{}, "Read")

      # No pending approvals, so await_approval fails
      assert {:error, :no_pending_approvals} = Conversation.await_approval(conv)

      # Can execute immediately
      assert {:ok, conv, _} = Conversation.execute_approved_tool(conv, "tool-1")
      assert {:ok, _conv, _} = Conversation.complete_tool_call(conv, "tool-1", %{content: "..."})
    end
  end

  describe "await_approval/1" do
    test "transitions to awaiting_approval when there are pending tools" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.await_approval(conv)

      assert new_conv.status == :awaiting_approval
      assert events == [{:status_changed, :awaiting_approval}]
    end

    test "rejects when no pending approvals" do
      conv = %{Conversation.new("conv-1") | status: :running, messages: []}

      assert {:error, :no_pending_approvals} = Conversation.await_approval(conv)
    end

    test "rejects when not running" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: :running}} =
               Conversation.await_approval(conv)
    end
  end

  describe "approve_tool_call/2" do
    test "marks tool as approved, stays awaiting_approval when more pending" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op1",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          },
          %{
            id: "tool-2",
            role: :tool_call,
            name: "op2",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.approve_tool_call(conv, "tool-1")

      # Stays awaiting_approval because tool-2 is still pending
      assert new_conv.status == :awaiting_approval

      assert [%{id: "tool-1", status: :approved}, %{id: "tool-2", status: :pending_approval}] =
               new_conv.messages

      assert events == [{:tool_call_approved, "tool-1"}]
    end

    test "transitions to running when last tool is approved" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.approve_tool_call(conv, "tool-1")

      assert new_conv.status == :running
      assert [%{status: :approved}] = new_conv.messages

      assert events == [
               {:tool_call_approved, "tool-1"},
               {:status_changed, :running}
             ]
    end

    test "rejects when not awaiting approval" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: :awaiting_approval}} =
               Conversation.approve_tool_call(conv, "tool-1")
    end

    test "rejects when tool not found" do
      conv = %{Conversation.new("conv-1") | status: :awaiting_approval, messages: []}

      assert {:error, {:tool_call_not_found, id: "tool-1"}} =
               Conversation.approve_tool_call(conv, "tool-1")
    end
  end

  describe "execute_approved_tool/2" do
    test "marks approved tool as executing" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.execute_approved_tool(conv, "tool-1")

      assert [%{status: :executing}] = new_conv.messages
      assert events == [{:tool_call_executing, "tool-1"}]
    end

    test "rejects when tool not approved" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:error, {:invalid_tool_status, current: :pending_approval, expected: :approved}} =
               Conversation.execute_approved_tool(conv, "tool-1")
    end

    test "rejects when not running" do
      conv = %{Conversation.new("conv-1") | status: :awaiting_approval}

      assert {:error, {:invalid_status, current: :awaiting_approval, expected: :running}} =
               Conversation.execute_approved_tool(conv, "tool-1")
    end
  end

  describe "next_approved_tool/1" do
    test "returns first approved tool" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            status: :completed,
            result: nil,
            error: nil,
            rejection_reason: nil,
            name: "op",
            arguments: %{},
            description: "desc"
          },
          %{
            id: "tool-2",
            role: :tool_call,
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil,
            name: "op",
            arguments: %{},
            description: "desc"
          },
          %{
            id: "tool-3",
            role: :tool_call,
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil,
            name: "op",
            arguments: %{},
            description: "desc"
          }
        ])

      assert %{id: "tool-2"} = Conversation.next_approved_tool(conv)
    end

    test "returns nil when no approved tools" do
      conv = Conversation.new("conv-1")

      assert nil == Conversation.next_approved_tool(conv)
    end
  end

  describe "reject_tool_call/3" do
    test "rejects tool and cascades to subsequent pending tools" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op1",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          },
          %{
            id: "tool-2",
            role: :tool_call,
            name: "op2",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          },
          %{
            id: "tool-3",
            role: :tool_call,
            name: "op3",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} =
               Conversation.reject_tool_call(conv, "tool-1", "Don't do this")

      # All get rejected - tool-1 with reason, tool-2 and tool-3 cascade
      assert new_conv.status == :running

      assert [
               %{id: "tool-1", status: :rejected, rejection_reason: "Don't do this"},
               %{
                 id: "tool-2",
                 status: :rejected,
                 rejection_reason: "cascade: previous tool rejected"
               },
               %{
                 id: "tool-3",
                 status: :rejected,
                 rejection_reason: "cascade: previous tool rejected"
               }
             ] = new_conv.messages

      assert events == [
               {:tool_call_rejected, "tool-1"},
               {:tool_call_rejected, "tool-2"},
               {:tool_call_rejected, "tool-3"},
               {:status_changed, :running}
             ]
    end

    test "only rejects tool and subsequent, preserves earlier approved" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op1",
            arguments: %{},
            description: "desc",
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil
          },
          %{
            id: "tool-2",
            role: :tool_call,
            name: "op2",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          },
          %{
            id: "tool-3",
            role: :tool_call,
            name: "op3",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.reject_tool_call(conv, "tool-2", "Nope")

      # tool-1 (approved) is preserved, tool-2 and tool-3 rejected
      assert [
               %{id: "tool-1", status: :approved},
               %{id: "tool-2", status: :rejected, rejection_reason: "Nope"},
               %{
                 id: "tool-3",
                 status: :rejected,
                 rejection_reason: "cascade: previous tool rejected"
               }
             ] = new_conv.messages

      assert events == [
               {:tool_call_rejected, "tool-2"},
               {:tool_call_rejected, "tool-3"},
               {:status_changed, :running}
             ]
    end

    test "works without a rejection reason" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, _events} = Conversation.reject_tool_call(conv, "tool-1")

      assert [%{status: :rejected, rejection_reason: nil}] = new_conv.messages
    end
  end

  describe "complete_tool_call/3" do
    test "marks tool as completed with result" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "create_doc",
            arguments: %{},
            description: "Create doc",
            status: :executing,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} =
               Conversation.complete_tool_call(conv, "tool-1", %{doc_id: "doc-123"})

      assert [%{status: :completed, result: %{doc_id: "doc-123"}}] = new_conv.messages
      assert events == [{:tool_call_completed, "tool-1"}]
    end

    test "rejects when tool not in executing status" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:error, {:invalid_tool_status, current: :approved, expected: :executing}} =
               Conversation.complete_tool_call(conv, "tool-1", %{})
    end
  end

  describe "fail_tool_call/3" do
    test "marks tool as failed with error" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :executing,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} =
               Conversation.fail_tool_call(conv, "tool-1", "Database connection failed")

      assert [%{status: :failed, error: "Database connection failed"}] = new_conv.messages
      assert events == [{:tool_call_failed, "tool-1", "Database connection failed"}]
    end
  end

  describe "cancel/1" do
    test "cancels streaming agent message and transitions to idle" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "msg-1", role: :user, content: "Hello"},
          %{id: "agent-1", role: :agent, content: "In 1942, it was said", status: :streaming}
        ])

      assert {:ok, new_conv, events} = Conversation.cancel(conv)

      assert new_conv.status == :idle

      assert [
               %{role: :user},
               %{role: :agent, status: :cancelled, content: "In 1942, it was said"}
             ] = new_conv.messages

      assert events == [
               {:agent_cancelled, "agent-1"},
               {:status_changed, :idle}
             ]
    end

    test "cancels pending tool calls when awaiting approval" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.cancel(conv)

      assert new_conv.status == :idle
      assert [%{status: :cancelled}] = new_conv.messages

      assert events == [
               {:tool_call_cancelled, "tool-1"},
               {:status_changed, :idle}
             ]
    end

    test "cancels approved (not yet executing) tool calls" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :approved,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.cancel(conv)

      assert new_conv.status == :idle
      assert [%{status: :cancelled}] = new_conv.messages

      assert events == [
               {:tool_call_cancelled, "tool-1"},
               {:status_changed, :idle}
             ]
    end

    test "cancels both streaming message and pending tool calls" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :awaiting_approval)
        |> Map.put(:messages, [
          %{id: "agent-1", role: :agent, content: "Let me help", status: :streaming},
          %{
            id: "tool-1",
            role: :tool_call,
            name: "op",
            arguments: %{},
            description: "desc",
            status: :pending_approval,
            result: nil,
            error: nil,
            rejection_reason: nil
          }
        ])

      assert {:ok, new_conv, events} = Conversation.cancel(conv)

      assert [
               %{role: :agent, status: :cancelled},
               %{role: :tool_call, status: :cancelled}
             ] = new_conv.messages

      assert {:agent_cancelled, "agent-1"} in events
      assert {:tool_call_cancelled, "tool-1"} in events
    end

    test "rejects when idle" do
      conv = Conversation.new("conv-1")

      assert {:error, {:invalid_status, current: :idle, expected: [:running, :awaiting_approval]}} =
               Conversation.cancel(conv)
    end
  end

  describe "set_error/2" do
    test "sets pending error and emits event" do
      conv = Conversation.new("conv-1")

      assert {:ok, new_conv, events} = Conversation.set_error(conv, "Connection lost")

      assert new_conv.pending_error == "Connection lost"
      assert events == [{:error, "Connection lost"}]
    end

    test "works in any status" do
      for status <- [:idle, :running, :awaiting_approval] do
        conv = %{Conversation.new("conv-1") | status: status}

        assert {:ok, new_conv, _events} = Conversation.set_error(conv, "Error")
        assert new_conv.pending_error == "Error"
      end
    end
  end

  describe "to_map/1" do
    test "serializes conversation to JSON-compatible map" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:status, :running)
        |> Map.put(:messages, [
          %{id: "msg-1", role: :user, content: "Hello"},
          %{id: "agent-1", role: :agent, content: "Hi there", status: :streaming}
        ])

      result = Conversation.to_map(conv)

      assert result == %{
               id: "conv-1",
               status: "running",
               messages: [
                 %{id: "msg-1", role: "user", content: "Hello"},
                 %{id: "agent-1", role: "agent", content: "Hi there", status: "streaming"}
               ],
               pending_error: nil
             }
    end

    test "serializes tool call messages" do
      conv =
        Conversation.new("conv-1")
        |> Map.put(:messages, [
          %{
            id: "tool-1",
            role: :tool_call,
            name: "create_document",
            arguments: %{"name" => "Test"},
            description: "Create a doc",
            status: :completed,
            result: %{id: "doc-1"},
            error: nil,
            rejection_reason: nil
          }
        ])

      result = Conversation.to_map(conv)

      assert [tool_map] = result.messages

      assert tool_map == %{
               id: "tool-1",
               role: "tool_call",
               name: "create_document",
               arguments: %{"name" => "Test"},
               description: "Create a doc",
               status: "completed",
               result: %{id: "doc-1"},
               error: nil,
               rejection_reason: nil
             }
    end
  end

  describe "full conversation flow" do
    test "user message -> agent response -> complete_run" do
      conv = Conversation.new("conv-1")

      # User sends message
      {:ok, conv, _} = Conversation.send_message(conv, "msg-1", "Hello")
      assert conv.status == :running

      # Agent starts response (ID is generated internally)
      {:ok, conv, _} = Conversation.start_agent_message(conv)

      # Agent streams chunks (finds streaming message automatically)
      {:ok, conv, _} = Conversation.append_chunk(conv, "Hi ")
      {:ok, conv, _} = Conversation.append_chunk(conv, "there!")

      # Agent run completes
      {:ok, conv, _} = Conversation.complete_run(conv)

      assert conv.status == :idle
      assert length(conv.messages) == 2

      assert [
               %{role: :user, content: "Hello"},
               %{role: :agent, content: "Hi there!", status: :complete}
             ] = conv.messages
    end

    test "tool call approval and execution flow" do
      conv = Conversation.new("conv-1")

      # User sends message
      {:ok, conv, _} = Conversation.send_message(conv, "msg-1", "Create a doc")
      assert conv.status == :running

      # Agent queues tool calls
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-1", "op1", %{}, "First op")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-2", "op2", %{}, "Second op")
      assert conv.status == :running

      # Agent signals ready for approval
      {:ok, conv, _} = Conversation.await_approval(conv)
      assert conv.status == :awaiting_approval

      # User approves first, stays awaiting because tool-2 pending
      {:ok, conv, _} = Conversation.approve_tool_call(conv, "tool-1")
      assert conv.status == :awaiting_approval

      # User approves second, transitions to running for execution
      {:ok, conv, _} = Conversation.approve_tool_call(conv, "tool-2")
      assert conv.status == :running

      # Execute first tool
      {:ok, conv, _} = Conversation.execute_approved_tool(conv, "tool-1")
      {:ok, conv, _} = Conversation.complete_tool_call(conv, "tool-1", %{result: 1})

      # Execute second tool
      {:ok, conv, _} = Conversation.execute_approved_tool(conv, "tool-2")
      {:ok, conv, _} = Conversation.complete_tool_call(conv, "tool-2", %{result: 2})

      # Agent completes run
      {:ok, conv, _} = Conversation.complete_run(conv)
      assert conv.status == :idle

      assert [
               %{role: :user},
               %{role: :tool_call, id: "tool-1", status: :completed},
               %{role: :tool_call, id: "tool-2", status: :completed}
             ] = conv.messages
    end

    test "tool call rejection with cascade" do
      conv = Conversation.new("conv-1")

      # User sends message
      {:ok, conv, _} = Conversation.send_message(conv, "msg-1", "Do three things")
      assert conv.status == :running

      # Agent queues multiple tools
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-1", "op1", %{}, "First")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-2", "op2", %{}, "Second")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-3", "op3", %{}, "Third")

      # Await approval
      {:ok, conv, _} = Conversation.await_approval(conv)

      # Approve first
      {:ok, conv, _} = Conversation.approve_tool_call(conv, "tool-1")

      # Reject second - should cascade to third
      {:ok, conv, _} = Conversation.reject_tool_call(conv, "tool-2", "Skip this")
      assert conv.status == :running

      # Execute the approved tool
      {:ok, conv, _} = Conversation.execute_approved_tool(conv, "tool-1")
      {:ok, conv, _} = Conversation.complete_tool_call(conv, "tool-1", %{done: true})

      # Complete run
      {:ok, conv, _} = Conversation.complete_run(conv)

      assert [
               %{role: :user},
               %{role: :tool_call, id: "tool-1", status: :completed},
               %{
                 role: :tool_call,
                 id: "tool-2",
                 status: :rejected,
                 rejection_reason: "Skip this"
               },
               %{
                 role: :tool_call,
                 id: "tool-3",
                 status: :rejected,
                 rejection_reason: "cascade: previous tool rejected"
               }
             ] = conv.messages
    end

    test "cancel approved but not yet executed tools" do
      conv = Conversation.new("conv-1")

      {:ok, conv, _} = Conversation.send_message(conv, "msg-1", "Do things")
      {:ok, conv, _} = Conversation.request_tool_call(conv, "tool-1", "op", %{}, "desc")
      {:ok, conv, _} = Conversation.await_approval(conv)
      {:ok, conv, _} = Conversation.approve_tool_call(conv, "tool-1")

      # Now approved but not executed - user can still cancel
      assert conv.status == :running
      assert [%{role: :user}, %{role: :tool_call, status: :approved}] = conv.messages

      {:ok, conv, _} = Conversation.cancel(conv)

      assert conv.status == :idle
      assert [%{role: :user}, %{role: :tool_call, status: :cancelled}] = conv.messages
    end
  end
end
