import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Channel } from "phoenix";
import { useParams } from "@tanstack/react-router";
import { getSocket } from "../lib/socket";
import { getMe } from "../lib/api";
import {
  ChatContext,
  type ChatMessage,
  type ChatStatus,
  type StreamingMessage,
  type ToolRequest,
} from "./chat";

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] =
    useState<StreamingMessage | null>(null);
  const streamingMessageRef = useRef<StreamingMessage | null>(null);
  const [pendingTool, setPendingTool] = useState<ToolRequest | null>(null);
  const [status, setStatus] = useState<ChatStatus>("idle");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);

  // Get current document ID from route params if available
  const params = useParams({ strict: false });
  const currentDocumentId = (params as { documentId?: string }).documentId;

  useEffect(() => {
    let cancelled = false;

    const setup = async () => {
      try {
        const user = await getMe();
        if (cancelled) return;

        const socket = getSocket();
        const channel = socket.channel(`chat:${user.id}`);

        // Set up event handlers
        channel.on("assistant_message", ({ content }) => {
          const message: ChatMessage = {
            id: crypto.randomUUID(),
            role: "assistant",
            content,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, message]);
        });

        channel.on("tool_request", (payload) => {
          setPendingTool({
            requestId: payload.request_id,
            toolName: payload.tool_name,
            toolInput: payload.tool_input,
            description: payload.description,
          });
        });

        channel.on("tool_result", (payload) => {
          // Tool result received - could update UI if needed
          console.log("Tool result:", payload);
        });

        channel.on("agent_status", ({ status: newStatus }) => {
          setStatus(newStatus as ChatStatus);
          // Clear pending tool when status changes away from awaiting_approval
          if (newStatus !== "awaiting_approval") {
            setPendingTool(null);
          }
        });

        channel.on("error", ({ message }) => {
          setError(message);
          setStatus("idle");
        });

        // Streaming event handlers
        channel.on("stream_start", () => {
          const newMessage: StreamingMessage = {
            id: crypto.randomUUID(),
            content: "",
            startTime: new Date(),
          };
          streamingMessageRef.current = newMessage;
          setStreamingMessage(newMessage);
        });

        channel.on("stream_delta", ({ text }: { text: string }) => {
          if (streamingMessageRef.current) {
            const updated = {
              ...streamingMessageRef.current,
              content: streamingMessageRef.current.content + text,
            };
            streamingMessageRef.current = updated;
            setStreamingMessage(updated);
          }
        });

        channel.on("stream_end", () => {
          // Finalize streaming message into messages array
          // We use a ref to get the current value without side effects in setState
          const current = streamingMessageRef.current;
          if (current && current.content) {
            const message: ChatMessage = {
              id: current.id,
              role: "assistant",
              content: current.content,
              timestamp: current.startTime,
            };
            setMessages((msgs) => [...msgs, message]);
          }
          streamingMessageRef.current = null;
          setStreamingMessage(null);
        });

        channel.on("stream_cancelled", () => {
          streamingMessageRef.current = null;
          setStreamingMessage(null);
        });

        // Join the channel
        await new Promise<void>((resolve, reject) => {
          channel
            .join()
            .receive("ok", (response) => {
              setSessionId(response.session_id);
              resolve();
            })
            .receive("error", (err) => reject(new Error(JSON.stringify(err))))
            .receive("timeout", () =>
              reject(new Error("Channel join timeout"))
            );
        });

        channelRef.current = channel;

        if (cancelled) {
          channel.leave();
          channelRef.current = null;
          return;
        }

        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to connect to chat"
          );
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.leave();
        channelRef.current = null;
      }
    };
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!channelRef.current || status !== "idle") return;

      // Add user message to local state immediately
      const message: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);

      // Send to server with current document context
      channelRef.current.push("user_message", {
        content,
        context: {
          document_id: currentDocumentId || null,
        },
      });
    },
    [status, currentDocumentId]
  );

  const approveToolRequest = useCallback((requestId: string) => {
    if (!channelRef.current) return;

    channelRef.current.push("tool_response", {
      request_id: requestId,
      approved: true,
    });
  }, []);

  const rejectToolRequest = useCallback((requestId: string) => {
    if (!channelRef.current) return;

    channelRef.current.push("tool_response", {
      request_id: requestId,
      approved: false,
    });
  }, []);

  const cancel = useCallback(() => {
    if (!channelRef.current) return;

    channelRef.current.push("cancel", {});
    setStatus("idle");
    streamingMessageRef.current = null;
    setStreamingMessage(null);
    setPendingTool(null);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        streamingMessage,
        pendingTool,
        status,
        sessionId,
        error,
        sendMessage,
        approveToolRequest,
        rejectToolRequest,
        cancel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
