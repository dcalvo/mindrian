import { useState } from "react";
import type { ToolCallMessage } from "../../hooks/chat/useChat";

interface ToolCallDisplayProps {
  tool: ToolCallMessage;
}

const STATUS_CONFIG: Record<
  ToolCallMessage["status"],
  { icon: string; label: string; className: string }
> = {
  pending_approval: { icon: "⏳", label: "Pending", className: "pending" },
  approved: { icon: "▶", label: "Approved", className: "approved" },
  executing: { icon: "⟳", label: "Executing", className: "executing" },
  completed: { icon: "✓", label: "Completed", className: "completed" },
  failed: { icon: "✗", label: "Failed", className: "failed" },
  rejected: { icon: "⊘", label: "Rejected", className: "rejected" },
  cancelled: { icon: "○", label: "Cancelled", className: "cancelled" },
};

export function ToolCallDisplay({ tool }: ToolCallDisplayProps) {
  const [argsExpanded, setArgsExpanded] = useState(false);
  const [resultExpanded, setResultExpanded] = useState(false);

  const config = STATUS_CONFIG[tool.status];
  const hasArgs = Object.keys(tool.arguments).length > 0;
  const hasResult = tool.status === "completed" && tool.result !== undefined;
  const hasError = tool.status === "failed" && tool.error;
  const hasRejectionReason =
    tool.status === "rejected" && tool.rejection_reason;

  return (
    <div className={`tool-call ${config.className}`}>
      <div className="tool-call-header">
        <span className={`tool-call-status-icon ${config.className}`}>
          {config.icon}
        </span>
        <span className="tool-call-name">{tool.name}</span>
        <span className="tool-call-status-label">{config.label}</span>
      </div>

      {hasArgs && (
        <div className="tool-call-section">
          <button
            className="tool-call-toggle"
            onClick={() => setArgsExpanded(!argsExpanded)}
          >
            <span className="tool-call-toggle-icon">
              {argsExpanded ? "▾" : "▸"}
            </span>
            Arguments
          </button>
          {argsExpanded && (
            <pre className="tool-call-json">
              {JSON.stringify(tool.arguments, null, 2)}
            </pre>
          )}
        </div>
      )}

      {hasResult && (
        <div className="tool-call-section">
          <button
            className="tool-call-toggle"
            onClick={() => setResultExpanded(!resultExpanded)}
          >
            <span className="tool-call-toggle-icon">
              {resultExpanded ? "▾" : "▸"}
            </span>
            Result
          </button>
          {resultExpanded && (
            <pre className="tool-call-json">
              {JSON.stringify(tool.result, null, 2)}
            </pre>
          )}
        </div>
      )}

      {hasError && (
        <div className="tool-call-error">
          <span className="tool-call-error-label">Error:</span> {tool.error}
        </div>
      )}

      {hasRejectionReason && (
        <div className="tool-call-rejection">
          <span className="tool-call-rejection-label">Reason:</span>{" "}
          {tool.rejection_reason}
        </div>
      )}
    </div>
  );
}
