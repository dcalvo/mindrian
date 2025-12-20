import Markdown from "react-markdown";
import type { Message, UserMessage, AgentMessage } from "../hooks/useChat";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Only render user and agent messages (tool calls handled separately)
  if (message.role === "tool_call") {
    return null;
  }

  const isUser = message.role === "user";
  const content = isUser
    ? (message as UserMessage).content
    : (message as AgentMessage).content;

  // Format timestamp if available
  const timestamp = message.inserted_at
    ? new Date(message.inserted_at).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className={`chat-message ${isUser ? "user" : "assistant"}`}>
      <div className="chat-message-header">
        <span className="chat-message-role">
          {isUser ? "You" : "Assistant"}
        </span>
        {timestamp && <span className="chat-message-time">{timestamp}</span>}
      </div>
      <div className="chat-message-content">
        {isUser ? content : <Markdown>{content}</Markdown>}
      </div>
    </div>
  );
}
