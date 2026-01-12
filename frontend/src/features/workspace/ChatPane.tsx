import { useState, useRef, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowUp, PanelRightClose, Maximize2, Minimize2 } from "lucide-react";
import {
  useChat,
  type AgentMessage,
  type ToolCallMessage,
  type Message,
} from "../../hooks/chat/useChat";
import { ChatMessage } from "./ChatMessage";
import { ToolApproval } from "./ToolApproval";
import { useEditorContext } from "../../contexts/EditorContext";
import { useDocumentsContext } from "../../contexts/DocumentsContext";
import "./ChatPane.css";

interface ChatPaneProps {
  onCollapse?: () => void;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
  workspaceId?: string;
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

/**
 * Detect which agent sent a specific message by looking at preceding Task calls.
 * Returns 'larry', 'explore', or null.
 */
function detectMessageAgent(
  messages: Message[],
  targetMessage: Message
): "larry" | "explore" | null {
  const messageIndex = messages.findIndex((m) => m.id === targetMessage.id);
  if (messageIndex === -1) return null;

  // Look backwards from this message to find the most recent Task call
  for (let i = messageIndex - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === "tool_call" && msg.name === "Task") {
      const args = msg.arguments as { subagent_type?: string };
      const subagentType = args.subagent_type;

      if (subagentType === "larry") return "larry";
      if (subagentType === "explore") return "explore";
    }
    // Stop searching if we hit a user message (new conversation turn)
    if (msg.role === "user") break;
  }

  return null;
}

export function ChatPane({
  onCollapse,
  onToggleExpand,
  isExpanded,
  workspaceId,
}: ChatPaneProps) {
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derive computed values from conversation
  const messages = useMemo(
    () => conversation?.messages ?? [],
    [conversation?.messages]
  );
  const status = conversation?.status ?? "idle";

  // Find streaming message (agent message with status "streaming")
  const streamingMessage = messages.find(
    (m): m is AgentMessage => m.role === "agent" && m.status === "streaming"
  );

  // Find pending tool (tool_call with status "pending_approval")
  const pendingTool = messages.find(
    (m): m is ToolCallMessage =>
      m.role === "tool_call" && m.status === "pending_approval"
  );

  // Filter out streaming messages from the main list (pending tools are shown)
  const displayMessages = messages.filter(
    (m) => !(m.role === "agent" && (m as AgentMessage).status === "streaming")
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

  // Auto-open documents created or opened by the agent
  useEffect(() => {
    for (const msg of messages) {
      if (msg.role !== "tool_call") continue;
      const tool = msg as ToolCallMessage;
      if (tool.status !== "completed") continue;
      const isOpenTool =
        tool.name.endsWith("create_document") ||
        tool.name.endsWith("open_document");
      if (!isOpenTool) continue;
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

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status !== "idle") return;

    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
          {onCollapse && !isExpanded && (
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
          {status !== "idle" && (
            <button className="chat-cancel-btn" onClick={cancel} title="Cancel">
              Cancel
            </button>
          )}
        </div>
      </div>

      {error && <div className="chat-error">{error}</div>}

      <div className="chat-messages">
        {displayMessages.length === 0 && !streamingMessage && !pendingTool && (
          <div className="chat-empty">
            <div className="chat-empty-text">
              Start a conversation with the AI assistant. It can help you
              create, read, and edit your documents.
            </div>
            <div className="chat-suggestions">
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={index}
                  className="chat-suggestion-chip"
                  onClick={() => {
                    if (status === "idle") {
                      sendMessage(suggestion.prompt);
                    }
                  }}
                  disabled={status !== "idle"}
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayMessages.map((message: Message) => {
          // Detect which agent sent this message (if it's an agent message)
          const agentType =
            message.role === "agent"
              ? detectMessageAgent(messages, message)
              : null;

          return (
            <ChatMessage
              key={message.id}
              message={message}
              agentType={agentType}
            />
          );
        })}

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
              <textarea
                ref={textareaRef}
                className="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  status === "idle" ? "Type a message..." : "Waiting..."
                }
                disabled={status !== "idle"}
                rows={1}
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
