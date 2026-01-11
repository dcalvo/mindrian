import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { ToolCallMessage } from "../../hooks/chat/useChat";

// Friendly labels for subagent types
const SUBAGENT_LABELS: Record<string, string> = {
  explore: "Exploring workspace...",
  larry: "Thinking with Larry...",
};

function formatToolName(name: string, args?: Record<string, unknown>): string {
  // For Task tool, use friendly subagent label if available
  if (name === "Task" && args?.subagent_type) {
    const subagentType = String(args.subagent_type);
    return SUBAGENT_LABELS[subagentType] ?? `Running ${subagentType}...`;
  }

  // Extract tool name from MCP format: "mcp__server__tool_name" -> "tool_name"
  const parts = name.split("__");
  const toolName = parts.length > 1 ? parts[parts.length - 1] : name;

  // Convert snake_case to Title Case
  return toolName
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

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

// Statuses where the tool call is "done" and can be collapsed
const TERMINAL_STATUSES = new Set<ToolCallMessage["status"]>([
  "completed",
  "failed",
  "rejected",
  "cancelled",
]);

export function ToolCallDisplay({ tool }: ToolCallDisplayProps) {
  const isTerminal = TERMINAL_STATUSES.has(tool.status);
  const [collapsed, setCollapsed] = useState(true);
  const [argsExpanded, setArgsExpanded] = useState(false);
  const [resultExpanded, setResultExpanded] = useState(false);

  const config = STATUS_CONFIG[tool.status];
  const hasArgs = Object.keys(tool.arguments).length > 0;
  const hasResult = tool.status === "completed" && tool.result !== undefined;
  const hasError = tool.status === "failed" && tool.error;
  const hasRejectionReason =
    tool.status === "rejected" && tool.rejection_reason;
  const hasContent = hasArgs || hasResult || hasError || hasRejectionReason;

  return (
    <div
      className={`tool-call ${config.className}${collapsed ? " collapsed" : ""}`}
    >
      <div
        className={`tool-call-header${isTerminal && hasContent ? " clickable" : ""}`}
        onClick={
          isTerminal && hasContent ? () => setCollapsed(!collapsed) : undefined
        }
      >
        <span className={`tool-call-status-icon ${config.className}`}>
          {config.icon}
        </span>
        <span className="tool-call-name">
          {formatToolName(tool.name, tool.arguments)}
        </span>
        <span className="tool-call-status-label">{config.label}</span>
        {isTerminal && hasContent && (
          <span className="tool-call-expand-icon">
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </span>
        )}
      </div>

      {!collapsed && (
        <>
          {hasArgs && (
            <div className="tool-call-section">
              <button
                className="tool-call-toggle"
                onClick={() => setArgsExpanded(!argsExpanded)}
              >
                <span className="tool-call-toggle-icon">
                  {argsExpanded ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
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
                  {resultExpanded ? (
                    <ChevronDown size={12} />
                  ) : (
                    <ChevronRight size={12} />
                  )}
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
        </>
      )}
    </div>
  );
}
