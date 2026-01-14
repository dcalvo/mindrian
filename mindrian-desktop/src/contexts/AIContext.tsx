import {
  Message,
  AgentMessage,
  ToolCallMessage,
  UserMessage,
} from "../hooks/chat/useChat";

export interface AIContextValue {
  provider: "claude" | "gemini";
  setProvider: (p: "claude" | "gemini") => void;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  sendMessage: (msg: string) => Promise<void>;
  messages: Message[];
  isStreaming: boolean;
}

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useWorkspacesContext } from "./WorkspacesContext";

const AIContext = createContext<AIContextValue | undefined>(undefined);

export const useAIContext = () => {
  const context = useContext(AIContext);
  if (!context) throw new Error("useAIContext must be used within AIProvider");
  return context;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] = useState<"claude" | "gemini">("gemini"); // Default to Local AI
  const [apiKey, setApiKeyState] = useState<string | null>(
    localStorage.getItem("gemini_api_key")
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const { workspaces, currentWorkspaceId } = useWorkspacesContext();
  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId);

  const setApiKey = (key: string) => {
    localStorage.setItem("gemini_api_key", key);
    setApiKeyState(key);
    // Tell backend
    if (window.ai) window.ai.setKey(key);
  };

  // Init key on load
  useEffect(() => {
    if (apiKey && window.ai) {
      window.ai.setKey(apiKey);
    }
  }, [apiKey]);

  // Setup stream listener
  useEffect(() => {
    if (!window.ai) return;

    window.ai.onStream((event: any) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (typeof event === "string" || event.type === "text_delta") {
          const content = typeof event === "string" ? event : event.content;

          if (last && last.role === "agent" && last.status === "streaming") {
            const agentMsg = last as AgentMessage;
            // Update existing streaming message
            return [
              ...prev.slice(0, -1),
              { ...agentMsg, content: agentMsg.content + content },
            ];
          } else {
            // New streaming chunk but no active agent message? Create one.
            // This happens if tool call finished and agent starts speaking again.
            return [
              ...prev,
              {
                id: crypto.randomUUID(),
                role: "agent",
                content: content,
                status: "streaming",
              } as AgentMessage,
            ];
          }
        } else if (event.type === "tool_call") {
          const { toolCall } = event;
          // Finish previous agent text message if it was streaming
          const messages = [...prev];
          if (last && last.role === "agent" && last.status === "streaming") {
            messages[messages.length - 1] = {
              ...last,
              status: "complete",
            } as AgentMessage;
          }

          return [
            ...messages,
            {
              id: crypto.randomUUID(),
              role: "tool_call",
              name: toolCall.name,
              arguments: toolCall.args,
              description: `Calling ${toolCall.name}...`,
              status: "executing", // Show as running immediately
            } as ToolCallMessage,
          ];
        } else if (event.type === "tool_result") {
          const { result } = event;
          // Find the running tool call and mark it complete
          // Since we don't have IDs from backend easily yet, we assume the last tool call
          // or we search backwards.
          // For now, robustly, look for the last tool call that is executing.
          const toolIndex = [...prev]
            .reverse()
            .findIndex(
              (m) => m.role === "tool_call" && m.status === "executing"
            );

          if (toolIndex !== -1) {
            const realIndex = prev.length - 1 - toolIndex;
            const toolMsg = prev[realIndex] as ToolCallMessage;
            const updated = [...prev];
            updated[realIndex] = {
              ...toolMsg,
              status: "completed",
              result: result,
            };
            return updated;
          }
          return prev;
        }

        return prev;
      });
    });
  }, []);

  const sendMessage = useCallback(
    async (msg: string) => {
      if (provider === "claude") {
        // TODO: Hook into existing Claude logic?
        // For now, let's focus on the new Gemini path.
        console.warn("Claude provider selected but not unified yet.");
        return;
      }

      if (!currentWorkspace) {
        console.error("No current workspace found", {
          currentWorkspaceId,
          workspacesCount: workspaces.length,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Error: Could not identify current workspace. Please try refreshing.",
          },
        ]);
        return;
      }

      // Optimistic UI
      const userMsgId = crypto.randomUUID();
      const userMsg: UserMessage = {
        id: userMsgId,
        role: "user",
        content: msg,
        inserted_at: new Date().toISOString(),
      };

      // Add user message AND an initial empty agent message to receive the stream immediately
      const agentMsgId = crypto.randomUUID();
      const agentMsg: AgentMessage = {
        id: agentMsgId,
        role: "agent",
        content: "",
        status: "streaming",
        inserted_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMsg, agentMsg]);
      setIsStreaming(true);

      try {
        if (!window.ai) throw new Error("AI Agent is not initialized");
        await window.ai.chat(msg, currentWorkspace.path);
      } catch (err: any) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "agent",
            content: "Error: " + err.message,
            status: "complete", // Mark as error/complete
          } as AgentMessage,
        ]);
      } finally {
        setIsStreaming(false);
        // Ensure last message is marked complete if it was streaming
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last && last.role === "agent" && last.status === "streaming") {
            return [
              ...prev.slice(0, -1),
              { ...last, status: "complete" } as AgentMessage,
            ];
          }
          return prev;
        });
      }
    },
    [provider, currentWorkspace]
  );

  return (
    <AIContext.Provider
      value={{
        provider,
        setProvider,
        apiKey,
        setApiKey,
        sendMessage,
        messages,
        isStreaming,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
