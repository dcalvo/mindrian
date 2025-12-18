import type { ToolRequest } from "../contexts/chat";

interface ToolApprovalProps {
  tool: ToolRequest;
  onApprove: () => void;
  onReject: () => void;
}

export function ToolApproval({ tool, onApprove, onReject }: ToolApprovalProps) {
  return (
    <div className="tool-approval">
      <div className="tool-approval-header">
        <span className="tool-approval-icon">🔧</span>
        <span className="tool-approval-title">Tool Request</span>
      </div>
      <div className="tool-approval-content">
        <div className="tool-approval-name">{tool.toolName}</div>
        <div className="tool-approval-description">{tool.description}</div>
        <details className="tool-approval-details">
          <summary>View parameters</summary>
          <pre>{JSON.stringify(tool.toolInput, null, 2)}</pre>
        </details>
      </div>
      <div className="tool-approval-actions">
        <button className="tool-approve-btn" onClick={onApprove}>
          Approve <kbd>⌘↵</kbd>
        </button>
        <button className="tool-reject-btn" onClick={onReject}>
          Reject <kbd>Esc</kbd>
        </button>
      </div>
    </div>
  );
}
