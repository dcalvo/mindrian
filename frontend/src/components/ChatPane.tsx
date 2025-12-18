import { useState, useRef, useEffect } from "react";
import { useChat } from "../hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ToolApproval } from "./ToolApproval";
import "./ChatPane.css";

export function ChatPane() {
  const {
    messages,
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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingTool]);

  // Keyboard shortcuts for tool approval and cancel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter to approve pending tool
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && pendingTool) {
        e.preventDefault();
        approveToolRequest(pendingTool.requestId);
      }
      // Escape to cancel/reject
      if (e.key === "Escape") {
        if (pendingTool) {
          rejectToolRequest(pendingTool.requestId);
        } else if (status !== "idle") {
          cancel();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pendingTool, status, approveToolRequest, rejectToolRequest, cancel]);

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
        {messages.length === 0 && !pendingTool && (
          <div className="chat-empty">
            Start a conversation with the AI assistant. It can help you create,
            read, and edit your documents.
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {pendingTool && (
          <ToolApproval
            tool={pendingTool}
            onApprove={() => approveToolRequest(pendingTool.requestId)}
            onReject={() => rejectToolRequest(pendingTool.requestId)}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-footer">
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
            placeholder={status === "idle" ? "Type a message..." : "Waiting..."}
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
      </div>
    </aside>
  );
}
