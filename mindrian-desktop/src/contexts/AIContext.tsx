export interface AIContextValue {
  provider: "claude" | "gemini";
  setProvider: (p: "claude" | "gemini") => void;
  apiKey: string | null;
  setApiKey: (key: string) => void;
  sendMessage: (msg: string) => Promise<void>;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
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
  const [provider, setProvider] = useState<"claude" | "gemini">("claude"); // Default to existing
  const [apiKey, setApiKeyState] = useState<string | null>(
    localStorage.getItem("gemini_api_key")
  );
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
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

    window.ai.onStream((chunk) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === "assistant") {
          return [
            ...prev.slice(0, -1),
            { ...last, content: last.content + chunk },
          ];
        } else {
          return [...prev, { role: "assistant", content: chunk }];
        }
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
      setMessages((prev) => [...prev, { role: "user", content: msg }]);
      setIsStreaming(true);

      try {
        if (!window.ai) throw new Error("AI Agent is not initialized");
        await window.ai.chat(msg, currentWorkspace.path);
      } catch (err) {
        console.error(err);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + err },
        ]);
      } finally {
        setIsStreaming(false);
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
