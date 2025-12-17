import { useRef, useState, useEffect } from "react";
import type { NodeRendererProps } from "react-arborist";
import {
  ChevronRight,
  FileText,
  Folder,
  Pencil,
  Trash2,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import type { TreeNode } from "../lib/tree";

export interface FileNodeProps extends NodeRendererProps<TreeNode> {
  onNavigate: (id: string, isFolder: boolean) => void;
  onDelete: (ids: string[]) => void;
  onCreateFile: (parentId: string) => void;
}

export function FileNode({
  node,
  style,
  dragHandle,
  onDelete,
  onCreateFile,
}: FileNodeProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!node.data.isFolder) {
      node.select();
      node.activate();
    } else {
      node.toggle();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    node.edit();
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
      onContextMenu={(e) => {
        e.preventDefault();
        // Position at cursor for right-click
        const x = Math.min(e.clientX, window.innerWidth - 160);
        const y = e.clientY;
        setMenuPos({ x, y });
        setShowMenu(true);
      }}
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
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="file-node-title">{node.data.name}</span>
      )}

      {/* Actions (hover) */}
      {!isEditing && (
        <div className="file-node-actions">
          {node.data.isFolder && (
            <button
              className="file-node-action"
              onClick={(e) => {
                e.stopPropagation();
                onCreateFile(node.id);
                if (!node.isOpen) node.toggle();
              }}
              title="New File"
            >
              <Plus size={14} />
            </button>
          )}

          {!node.data.isFolder && (
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
          )}

          <button
            className="file-node-action danger"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(`Delete "${node.data.name}"?`)) {
                onDelete([node.id]);
              }
            }}
            title="Delete"
          >
            <Trash2 size={14} />
          </button>

          <div style={{ position: "relative" }}>
            <button
              className="file-node-action"
              onClick={(e) => {
                e.stopPropagation();
                // Position at cursor for consistency with right-click
                const x = Math.min(e.clientX, window.innerWidth - 160);
                const y = e.clientY;
                setMenuPos({ x, y });
                setShowMenu(!showMenu);
              }}
              title="More actions"
            >
              <MoreHorizontal size={14} />
            </button>

            {/* Context Menu */}
            {showMenu && (
              <div
                ref={menuRef}
                className="file-node-menu"
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "fixed",
                  zIndex: 1000,
                  top: menuPos.y,
                  left: menuPos.x,
                }}
              >
                <button
                  onClick={() => {
                    setShowMenu(false);
                    node.edit();
                  }}
                >
                  <Pencil size={12} /> Rename
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    setShowMenu(false);
                    if (confirm(`Delete "${node.data.name}"?`)) {
                      onDelete([node.id]);
                    }
                  }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
