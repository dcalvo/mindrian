import Markdown from "react-markdown";
import type {
  Message,
  UserMessage,
  AgentMessage,
  ToolCallMessage,
} from "../hooks/useChat";
import { ToolCallDisplay } from "./ToolCallDisplay";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // Render tool calls with dedicated component
  if (message.role === "tool_call") {
    return <ToolCallDisplay tool={message as ToolCallMessage} />;
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
