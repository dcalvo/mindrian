import { useRef } from "react";
import type { NodeRendererProps } from "react-arborist";
import { ChevronRight, FileText, Folder, Pencil, Trash2 } from "lucide-react";
import type { TreeNode } from "../lib/tree";

interface FileNodeProps extends NodeRendererProps<TreeNode> {
  onNavigate: (id: string, isFolder: boolean) => void;
  onDelete: (id: string) => void;
}

export function FileNode({ node, style, dragHandle, tree }: FileNodeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.data.isFolder) {
      // Navigate to document - handled by parent
      node.select();
      node.activate();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.data.isFolder) {
      node.edit();
    }
  };

  const handleSubmit = (name: string) => {
    node.submit(name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e.currentTarget.value);
    } else if (e.key === "Escape") {
      node.reset();
    }
  };

  const isSelected = node.isSelected;
  const isEditing = node.isEditing;

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`file-node ${isSelected ? "selected" : ""} ${
        node.state.willReceiveDrop ? "drop-target" : ""
      }`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Chevron for folders */}
      {node.data.isFolder ? (
        <span
          className={`file-node-chevron ${node.isOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            node.toggle();
          }}
        >
          <ChevronRight size={14} />
        </span>
      ) : (
        <span className="file-node-chevron" style={{ visibility: "hidden" }}>
          <ChevronRight size={14} />
        </span>
      )}

      {/* Icon */}
      <span className={`file-node-icon ${node.data.isFolder ? "folder" : ""}`}>
        {node.data.isFolder ? <Folder size={16} /> : <FileText size={16} />}
      </span>

      {/* Title */}
      {isEditing ? (
        <input
          ref={inputRef}
          className="file-node-title-input"
          defaultValue={node.data.name}
          onBlur={(e) => handleSubmit(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      ) : (
        <span className="file-node-title">{node.data.name}</span>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="file-node-actions">
          <button
            className="file-node-action"
            onClick={(e) => {
              e.stopPropagation();
              node.edit();
            }}
            title="Rename"
          >
            <Pencil size={12} />
          </button>
          <button
            className="file-node-action danger"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${node.data.name}"?`)) {
                tree.delete(node.id);
              }
            }}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
