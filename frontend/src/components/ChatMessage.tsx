import type { ChatMessage as ChatMessageType } from "../contexts/chat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
      <div className="chat-message-header">
        <span className="chat-message-role">{isUser ? "You" : "Assistant"}</span>
        <span className="chat-message-time">
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="chat-message-content">{message.content}</div>
    </div>
  );
}
