import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { usePreviewNavigationContext } from "../../contexts/PreviewNavigationContext";
import { usePreviewContext } from "../../contexts/PreviewContext";
import { FileTree } from "./FileTree";
import "./workspace.css";

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const COLLAPSED_WIDTH = 60;

export const WorkspaceSidebar: React.FC = () => {
  const { activeWorkspace } = usePreviewContext();
  const { pop } = usePreviewNavigationContext();

  const [width, setWidth] = useState(260);
  const [isOpen, setIsOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && sidebarRef.current) {
      const newWidth =
        e.clientX - sidebarRef.current.getBoundingClientRect().left;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setWidth(newWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing]);

  if (!activeWorkspace) return null;
  const Icon = activeWorkspace.icon;

  return (
    <>
      <motion.aside
        ref={sidebarRef}
        className="workspace-panel workspace-sidebar"
        animate={{ width: isOpen ? width : COLLAPSED_WIDTH }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          duration: 0.2,
        }}
        style={{ position: "relative" }}
      >
        {/* Sidebar Controls */}
        <div
          className="sidebar-controls"
          style={{
            display: "flex",
            justifyContent: isOpen ? "space-between" : "center",
            padding: "12px 12px 0",
            gap: "8px",
          }}
        >
          <button
            className="icon-btn-ghost"
            onClick={pop}
            title="Back to Dashboard"
            style={{
              padding: "6px",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              color: "var(--preview-text-secondary)",
              display: "flex",
              borderRadius: "6px",
            }}
          >
            <ArrowLeft size={18} />
            {isOpen && (
              <span
                style={{
                  marginLeft: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Back
              </span>
            )}
          </button>

          {isOpen && (
            <button
              className="icon-btn-ghost"
              onClick={() => setIsOpen(false)}
              style={{
                padding: "6px",
                cursor: "pointer",
                background: "transparent",
                border: "none",
                color: "var(--preview-text-tertiary)",
              }}
            >
              <PanelLeftClose size={16} />
            </button>
          )}
        </div>

        <div
          className="workspace-sidebar-identity"
          style={{
            justifyContent: isOpen ? "flex-start" : "center",
            padding: isOpen ? "16px" : "16px 0",
          }}
        >
          <div
            className="workspace-sidebar-icon"
            style={{ backgroundColor: activeWorkspace.bgColor }}
          >
            <Icon size={18} color={activeWorkspace.iconColor} />
          </div>
          {isOpen && (
            <span
              style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "var(--preview-text-primary)",
                marginLeft: "12px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {activeWorkspace.name}
            </span>
          )}
        </div>

        {!isOpen && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "12px",
            }}
          >
            <button
              onClick={() => setIsOpen(true)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--preview-text-tertiary)",
              }}
            >
              <PanelLeftOpen size={16} />
            </button>
          </div>
        )}

        <div
          className="workspace-sidebar-content"
          style={{
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? "auto" : "none",
            display: isOpen ? "block" : "none",
          }}
        >
          <FileTree />
        </div>

        {/* Resize Handle */}
        {isOpen && (
          <div className="resize-handle-vertical" onMouseDown={startResizing} />
        )}
      </motion.aside>
    </>
  );
};
