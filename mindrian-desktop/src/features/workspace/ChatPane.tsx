import { useState, useRef, useEffect } from "react";
import { ArrowUp, Maximize2, Minimize2 } from "lucide-react";
import { type AgentMessage, type Message } from "../../hooks/chat/useChat";
import { ChatMessage } from "./ChatMessage";
import { useAIContext } from "../../contexts/AIContext";
import "./ChatPane.css";

interface ChatPaneProps {
  onCollapse?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

// Conversation starter suggestions
const SUGGESTIONS = [
  {
    label: "Help me think about where AI coding assistants trend is going",
    prompt: "Help me think about where AI coding assistants trend is going",
  },
  {
    label: "What's happening with the advertising industry structure?",
    prompt: "What's happening with the advertising industry structure?",
  },
  {
    label: "I want to find opportunities in how people manage finances",
    prompt: "I want to find opportunities in how people manage finances",
  },
  {
    label: "What opportunities emerge from aging populations?",
    prompt: "What opportunities emerge from aging populations?",
  },
];

export function ChatPane({
  onToggleExpand,
  isExpanded,
}: ChatPaneProps & { onCollapse?: () => void }) {
  // New AI Context (Gemini / Mindrian Agent)
  const {
    sendMessage: sendAiMessage,
    messages: aiMessages,
    isStreaming,
  } = useAIContext();

  const [input, setInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const messages = aiMessages;

  // Find streaming message (agent message with status "streaming")
  // In the new context, streaming updates are applied directly to the message content,
  // so we check if the last message is from agent and streaming.
  const streamingMessage =
    messages.length > 0 &&
    messages[messages.length - 1].role === "agent" &&
    (messages[messages.length - 1] as AgentMessage).status === "streaming"
      ? (messages[messages.length - 1] as AgentMessage)
      : null;

  // In V1 Agent Loop, tools run automatically in the backend.
  // We don't need manual approval in frontend for now.

  // No explicit tool approval needed for now in V1 Agent Loop (auto-run)
  // unless we add "Human in the Loop" middleware later.

  // Filter out streaming messages from the main list so we don't duplicate logic
  // actually for the new setup, the streaming message IS in the list, so we just render naturally.
  const displayMessages = messages;

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Backend will handle key validation, no need to check here
    sendAiMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <aside className="chat-pane">
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="chat-title">
            <span style={{ fontWeight: 700, fontSize: "15px" }}>
              Mindrian AI
            </span>
          </div>
        </div>
        <div className="chat-header-right">
          {onToggleExpand && (
            <button
              className="chat-expand-btn"
              onClick={onToggleExpand}
              title={isExpanded ? "Restore Panel" : "Maximize Panel"}
            >
              {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className="chat-messages">
        {displayMessages.length === 0 && !isStreaming && (
          <div className="chat-empty">
            <div className="chat-empty-text">
              I'm Mindrian, your smart coding companion. I can help you edit
              files, explore your workspace, and build complex features.
            </div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  className="chat-suggestion-chip"
                  onClick={() => {
                    if (!isStreaming) sendAiMessage(suggestion.prompt);
                  }}
                  disabled={isStreaming}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayMessages.map((message: Message) => {
          return (
            <ChatMessage
              key={message.id}
              message={message}
              agentType={null} // Auto-detected by backend now
            />
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        <>
          {isStreaming && (
            <div className="chat-status">
              <span className="chat-status-indicator" />
              Mindrian is thinking...
            </div>
          )}

          <form className="chat-input-form" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!isStreaming ? "Type a message..." : "Waiting..."}
              disabled={isStreaming}
              rows={1}
            />
            <button
              type="submit"
              className="chat-send-btn icon-only"
              disabled={!input.trim() || isStreaming}
              title="Send Message"
            >
              <ArrowUp size={18} />
            </button>
          </form>
        </>
      </div>
    </aside>
  );
}
