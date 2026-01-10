import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, PanelRightClose } from "lucide-react";
import {
  useChat,
  type AgentMessage,
  type ToolCallMessage,
} from "../../hooks/chat/useChat";
import { ChatMessage } from "./ChatMessage";
import { ToolApproval } from "./ToolApproval";
import { useEditorContext } from "../../contexts/EditorContext";
import { useDocumentsContext } from "../../contexts/DocumentsContext";
import "./ChatPane.css";

interface ChatPaneProps {
  onCollapse?: () => void;
  workspaceId?: string;
}

export function ChatPane({ onCollapse, workspaceId }: ChatPaneProps) {
  const [conversationId] = useState(() => crypto.randomUUID());
  const {
    conversation,
    error,
    sendMessage,
    approveToolCall,
    rejectToolCall,
    cancel,
  } = useChat(conversationId, workspaceId);

  const { openDocument } = useEditorContext();
  const { documents } = useDocumentsContext();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const openedDocsRef = useRef<Set<string>>(new Set());

  // Derive computed values from conversation
  const messages = useMemo(
    () => conversation?.messages ?? [],
    [conversation?.messages]
  );
  const status = conversation?.status ?? "idle";

  // Find streaming message (agent message with status "streaming")
  const streamingMessage = messages.find(
    (m: any): m is AgentMessage =>
      m.role === "agent" && m.status === "streaming"
  );

  // Find pending tool (tool_call with status "pending_approval")
  const pendingTool = messages.find(
    (m: any): m is ToolCallMessage =>
      m.role === "tool_call" && m.status === "pending_approval"
  );

  // Filter out streaming messages and pending tools from the main list
  const displayMessages = messages.filter(
    (m: any) =>
      !(m.role === "agent" && (m as AgentMessage).status === "streaming") &&
      !(
        m.role === "tool_call" &&
        (m as ToolCallMessage).status === "pending_approval"
      )
  );

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

  // Auto-open documents created by the agent
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "tool_call") continue;
      const tool = msg as ToolCallMessage;
      if (tool.status !== "completed") continue;
      if (!tool.name.endsWith("create_document")) continue;
      if (openedDocsRef.current.has(tool.id)) continue;

      const result = tool.result as { document_id?: string } | undefined;
      if (!result?.document_id) continue;

      const doc = documents.find((d) => d.id === result.document_id);
      if (doc) {
        openedDocsRef.current.add(tool.id);
        openDocument(doc);
      }
    }
  }, [messages, documents, openDocument]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "idle") return;

    sendMessage(input.trim());
    setInput("");
  };

  const getStatusText = () => {
    switch (status) {
      case "running":
        return streamingMessage ? null : "Thinking...";
      case "awaiting_approval":
        return "Waiting for approval";
      default:
        return null;
    }
  };

  return (
    <aside className="chat-pane">
      <div className="chat-header">
        <div className="chat-header-left">
          {onCollapse && (
            <button
              className="chat-collapse-btn"
              onClick={onCollapse}
              title="Collapse Panel"
            >
              <PanelRightClose size={16} />
            </button>
          )}
          <h3>Chat</h3>
        </div>
        {status !== "idle" && (
          <button className="chat-cancel-btn" onClick={cancel} title="Cancel">
            Cancel
          </button>
        )}
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-messages">
        {displayMessages.length === 0 && !streamingMessage && !pendingTool && (
          <div className="chat-empty">
            Start a conversation with the AI assistant. It can help you create,
            read, and edit your documents.
          </div>
        )}

        {displayMessages.map((message: any) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {streamingMessage && (
          <div className="chat-message assistant streaming">
            <div className="chat-message-header">
              <span className="chat-message-role">Assistant</span>
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
            onApprove={() => approveToolCall(pendingTool.id)}
            onReject={(reason) => rejectToolCall(pendingTool.id, reason)}
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
                className="chat-send-btn icon-only"
                disabled={!input.trim() || status !== "idle"}
                title="Send Message"
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </>
        )}
      </div>
    </aside>
  );
}
