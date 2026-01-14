import { useState, useEffect, useRef } from "react";
import type { ToolCallMessage } from "../../hooks/chat/useChat";
import type { Document } from "../../lib/api";
import { useDocumentsContext } from "../../contexts/DocumentsContext";

function formatArgValue(
  key: string,
  value: unknown,
  documents: Document[]
): string {
  // Look up document title for document_id fields
  if (key === "document_id" && typeof value === "string") {
    const doc = documents.find((d) => d.id === value);
    return doc ? `"${doc.title}"` : value;
  }

  if (typeof value === "string") {
    return value.length > 40 ? value.slice(0, 40) + "…" : value;
  }
  if (Array.isArray(value)) {
    return `${value.length} item${value.length !== 1 ? "s" : ""}`;
  }
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value).slice(0, 40) + "…";
  }
  return String(value);
}

function formatArgKey(key: string): string {
  // Use friendlier label for document_id
  if (key === "document_id") return "Document";

  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatArgs(
  args: Record<string, unknown>,
  documents: Document[]
): string[] {
  return Object.entries(args).map(
    ([key, value]) =>
      `${formatArgKey(key)}: ${formatArgValue(key, value, documents)}`
  );
}

interface ToolApprovalProps {
  tool: ToolCallMessage;
  onApprove: () => void;
  onReject: (message?: string) => void;
}

export function ToolApproval({ tool, onApprove, onReject }: ToolApprovalProps) {
  const { documents } = useDocumentsContext();
  const [selected, setSelected] = useState(0);
  const [customMessage, setCustomMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelected((s) => (s > 0 ? s - 1 : 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelected((s) => (s < 1 ? s + 1 : 0));
      } else if (e.key === "Enter" && selected === 0) {
        e.preventDefault();
        onApprove();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onReject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, onApprove, onReject]);

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customMessage.trim()) {
      e.preventDefault();
      onReject(customMessage.trim());
    }
  };

  return (
    <div className="tool-prompt" onClick={() => inputRef.current?.focus()}>
      <div className="tool-prompt-action">{tool.description}</div>
      {Object.keys(tool.arguments).length > 0 && (
        <div className="tool-prompt-args">
          {formatArgs(tool.arguments, documents).map((arg, i) => (
            <div key={i} className="tool-prompt-arg">
              {arg}
            </div>
          ))}
        </div>
      )}
      <div className="tool-prompt-question">Do you want to proceed?</div>
      <div className="tool-prompt-options">
        <div
          className={`tool-prompt-option ${selected === 0 ? "selected" : ""}`}
          onClick={onApprove}
        >
          <span className="tool-prompt-indicator">
            {selected === 0 ? ">" : " "}
          </span>
          <span>1. Yes</span>
        </div>
        <div
          className={`tool-prompt-option ${selected === 1 ? "selected" : ""}`}
          onClick={() => inputRef.current?.focus()}
        >
          <span className="tool-prompt-indicator">
            {selected === 1 ? ">" : " "}
          </span>
          <span>2. </span>
          <input
            ref={inputRef}
            type="text"
            className="tool-prompt-input"
            placeholder="Type to tell Mindrian what to do differently"
            value={customMessage}
            onChange={(e) => {
              setCustomMessage(e.target.value);
              setSelected(1);
            }}
            onKeyDown={handleInputKeyDown}
          />
        </div>
      </div>
      <div className="tool-prompt-hint">Esc to cancel</div>
    </div>
  );
}
