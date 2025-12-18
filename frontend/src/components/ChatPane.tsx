import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ToolApproval } from "./ToolApproval";
import "./ChatPane.css";

export function ChatPane() {
  const {
    messages,
    streamingMessage,
    pendingTool,
    status,
    error,
    sendMessage,
    approveToolRequest,
    rejectToolRequest,
    cancel,
  } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive or streaming updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage, pendingTool]);

  // Escape to cancel (when not awaiting tool approval)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pendingTool && status !== "idle") {
        cancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingTool, status, cancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "idle") return;

    sendMessage(input.trim());
    setInput("");
  };

  const getStatusText = () => {
    switch (status) {
      case "thinking":
        return "Thinking...";
      case "streaming":
        return null; // Don't show status text while streaming - the message itself shows progress
      case "awaiting_approval":
        return "Waiting for approval";
      case "executing":
        return "Executing tool...";
      default:
        return null;
    }
  };

  return (
    <aside className="chat-pane">
      <div className="chat-header">
        <h3>Chat</h3>
        {status !== "idle" && (
          <button className="chat-cancel-btn" onClick={cancel} title="Cancel">
            Cancel
          </button>
        )}
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-messages">
        {messages.length === 0 && !streamingMessage && !pendingTool && (
          <div className="chat-empty">
            Start a conversation with the AI assistant. It can help you create,
            read, and edit your documents.
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {streamingMessage && (
          <div className="chat-message assistant streaming">
            <div className="chat-message-header">
              <span className="chat-message-role">Assistant</span>
              <span className="chat-message-time">
                {streamingMessage.startTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="chat-message-content">
              <ReactMarkdown>{streamingMessage.content}</ReactMarkdown>
              <span className="streaming-cursor">▋</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
        {pendingTool ? (
          <ToolApproval
            tool={pendingTool}
            onApprove={() => approveToolRequest(pendingTool.requestId)}
            onReject={() => rejectToolRequest(pendingTool.requestId)}
          />
        ) : (
          <>
            {getStatusText() && (
              <div className="chat-status">
                <span className="chat-status-indicator" />
                {getStatusText()}
              </div>
            )}
            <form className="chat-input-form" onSubmit={handleSubmit}>
              <input
                type="text"
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  status === "idle" ? "Type a message..." : "Waiting..."
                }
                disabled={status !== "idle"}
              />
              <button
                type="submit"
                className="chat-send-btn"
                disabled={!input.trim() || status !== "idle"}
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </aside>
  );
}
