import { useState, useEffect, useRef, useCallback } from "react";
import type { Channel } from "phoenix";
import { getSocket } from "../../lib/socket";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ConversationStatus = "idle" | "running" | "awaiting_approval";

export type MessageStatus = "streaming" | "complete" | "cancelled";
export type ToolStatus =
  | "pending_approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rejected"
  | "cancelled";

interface BaseMessage {
  id: string;
}

export interface UserMessage extends BaseMessage {
  role: "user";
  content: string;
  inserted_at?: string;
}

export interface AgentMessage extends BaseMessage {
  role: "agent";
  content: string;
  status: MessageStatus;
  inserted_at?: string;
}

export interface ToolCallMessage extends BaseMessage {
  role: "tool_call";
  name: string;
  arguments: Record<string, unknown>;
  description: string;
  status: ToolStatus;
  result?: unknown;
  error?: string;
  rejection_reason?: string;
  inserted_at?: string;
}

export type Message = UserMessage | AgentMessage | ToolCallMessage;

export interface Conversation {
  id: string;
  status: ConversationStatus;
  messages: Message[];
  pending_error: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function updateMessage(
  conv: Conversation,
  id: string,
  fn: (msg: Message) => Message
): Conversation {
  return {
    ...conv,
    messages: conv.messages.map((m) => (m.id === id ? fn(m) : m)),
  };
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useChat(conversationId: string, workspaceId?: string) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    const socket = getSocket();
    const channel = socket.channel(`chat:${conversationId}`, {
      workspace_id: workspaceId,
    });

    channel.on("event", (event: { type: string; [key: string]: unknown }) => {
      setConversation((prev) => {
        if (!prev) return prev;

        switch (event.type) {
          case "status_changed":
            return { ...prev, status: event.status as ConversationStatus };

          case "agent_started":
            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: event.message_id as string,
                  role: "agent",
                  content: "",
                  status: "streaming",
                } as AgentMessage,
              ],
            };

          case "agent_chunk":
            return updateMessage(prev, event.message_id as string, (msg) => {
              const agent = msg as AgentMessage;
              return {
                ...agent,
                content: agent.content + (event.chunk as string),
              };
            });

          case "agent_complete":
            return updateMessage(prev, event.message_id as string, (msg) => {
              const agent = msg as AgentMessage;
              return { ...agent, status: "complete" as const };
            });

          case "agent_cancelled":
            return updateMessage(prev, event.message_id as string, (msg) => {
              const agent = msg as AgentMessage;
              return { ...agent, status: "cancelled" as const };
            });

          case "tool_call_requested":
            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: event.id as string,
                  role: "tool_call",
                  name: event.name as string,
                  arguments: event.arguments as Record<string, unknown>,
                  description: event.description as string,
                  status: "pending_approval",
                } as ToolCallMessage,
              ],
            };

          case "tool_call_approved":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return { ...tool, status: "approved" as const };
            });

          case "tool_call_executing":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return { ...tool, status: "executing" as const };
            });

          case "tool_call_completed":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return {
                ...tool,
                status: "completed" as const,
                result: event.result,
              };
            });

          case "tool_call_failed":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return {
                ...tool,
                status: "failed" as const,
                error: event.error as string,
              };
            });

          case "tool_call_rejected":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return { ...tool, status: "rejected" as const };
            });

          case "tool_call_cancelled":
            return updateMessage(prev, event.id as string, (msg) => {
              const tool = msg as ToolCallMessage;
              return { ...tool, status: "cancelled" as const };
            });

          case "error":
            return { ...prev, pending_error: event.message as string };

          default:
            return prev;
        }
      });
    });

    channel
      .join()
      .receive("ok", (reply: Conversation) => {
        setConversation(reply);
        setError(null);
      })
      .receive("error", (err: { reason?: string }) => {
        setError(err.reason || "Failed to join channel");
      });

    channelRef.current = channel;

    return () => {
      channel.leave();
      channelRef.current = null;
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!conversation || conversation.status !== "idle") return;

      const id = crypto.randomUUID();

      // Optimistic update
      setConversation((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          messages: [
            ...prev.messages,
            { id, role: "user", content } as UserMessage,
          ],
        };
      });

      // Send with ID so backend uses the same ID
      channelRef.current
        ?.push("send_message", { id, content })
        .receive("error", (err: { reason?: string; message?: string }) => {
          // Rollback on error
          setConversation((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              messages: prev.messages.filter((m) => m.id !== id),
            };
          });
          setError(err.reason || err.message || "Failed to send message");
        });
    },
    [conversation]
  );

  const approveToolCall = useCallback((toolId: string) => {
    channelRef.current
      ?.push("approve_tool_call", { tool_id: toolId })
      .receive("error", (err: { reason?: string; message?: string }) => {
        setError(err.reason || err.message || "Failed to approve tool call");
      });
  }, []);

  const rejectToolCall = useCallback((toolId: string, reason?: string) => {
    channelRef.current
      ?.push("reject_tool_call", { tool_id: toolId, reason })
      .receive("error", (err: { reason?: string; message?: string }) => {
        setError(err.reason || err.message || "Failed to reject tool call");
      });
  }, []);

  const cancel = useCallback(() => {
    channelRef.current
      ?.push("cancel", {})
      .receive("error", (err: { reason?: string; message?: string }) => {
        setError(err.reason || err.message || "Failed to cancel");
      });
  }, []);

  return {
    conversation,
    error,
    sendMessage,
    approveToolCall,
    rejectToolCall,
    cancel,
  };
}
