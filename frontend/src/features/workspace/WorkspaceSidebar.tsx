import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, PanelLeftClose } from "lucide-react";
import { useDashboardNavigationContext } from "../../contexts/DashboardNavigationContext";
import { useWorkspacesContext } from "../../contexts/WorkspacesContext";
import { FileTree } from "./FileTree";
import {
  Briefcase as BriefcaseIcon,
  TrendingUp,
  Code,
  BookOpen,
  Terminal,
  Cpu,
  Globe,
  Zap,
} from "lucide-react";
import "./workspace.css";

const MIN_WIDTH = 240;
const MAX_WIDTH = 480;
const COLLAPSED_WIDTH = 60;

export const WorkspaceSidebar: React.FC = () => {
  const { current } = useDashboardNavigationContext();
  const { workspaces, currentWorkspaceId } = useWorkspacesContext();
  const { pop } = useDashboardNavigationContext();

  const getIcon = (iconId: string) => {
    switch (iconId) {
      case "briefcase":
        return BriefcaseIcon;
      case "trending-up":
        return TrendingUp;
      case "code":
        return Code;
      case "book-open":
        return BookOpen;
      case "terminal":
        return Terminal;
      case "cpu":
        return Cpu;
      case "globe":
        return Globe;
      case "zap":
        return Zap;
      default:
        return BriefcaseIcon;
    }
  };

  const workspaceId = currentWorkspaceId || current.workspaceId;
  const activeWorkspace = workspaceId
    ? workspaces.find((w) => w.id === workspaceId)
    : null;

  const workspaceData = activeWorkspace
    ? {
        name: activeWorkspace.title,
        icon: getIcon(activeWorkspace.icon),
        bgColor: activeWorkspace.bg_color,
        iconColor: activeWorkspace.icon_color,
      }
    : {
        name: "Workspace",
        icon: BriefcaseIcon,
        bgColor: "#000000",
        iconColor: "#ffffff",
      };

  const [width, setWidth] = useState(260);
  const [isOpen, setIsOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
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

  // Handle click to expand when collapsed
  const handleSidebarClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      // Don't expand if clicking the back button
      const target = e.target as HTMLElement;
      if (!target.closest(".back-btn-area")) {
        setIsOpen(true);
      }
    }
  };

  if (!workspaceData) return null;
  const Icon = workspaceData.icon;

  const currentWidth = isOpen ? width : isHovered ? 80 : COLLAPSED_WIDTH;

  return (
    <>
      <motion.aside
        ref={sidebarRef}
        className="workspace-panel workspace-sidebar"
        animate={{ width: currentWidth }}
        onMouseEnter={() => !isOpen && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        style={{
          position: "relative",
          cursor: !isOpen ? "pointer" : "default",
          zIndex: !isOpen && isHovered ? 20 : 1,
        }}
        onClick={handleSidebarClick}
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
            className="icon-btn-ghost back-btn-area"
            onClick={(e) => {
              e.stopPropagation();
              pop();
            }}
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
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
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
            transition: "all 0.2s ease",
          }}
        >
          <div
            className="workspace-sidebar-icon"
            style={{
              backgroundColor: workspaceData.bgColor,
              transform: !isOpen && isHovered ? "scale(1.1)" : "scale(1)",
              transition: "transform 0.2s ease",
            }}
          >
            <Icon size={18} color={workspaceData.iconColor} />
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
              {workspaceData.name}
            </span>
          )}
        </div>

        {!isOpen && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingBottom: "40px",
              opacity: isHovered ? 0.3 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            {/* Subtle indicator of interactivity */}
            <div
              style={{
                width: "2px",
                height: "20px",
                background: "var(--preview-text-tertiary)",
                borderRadius: "2px",
              }}
            />
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
