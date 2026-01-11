/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useWorkspacesContext } from "../contexts/WorkspacesContext";
import { ChatPane } from "../features/workspace/ChatPane";
import { WorkspaceSidebar } from "../features/workspace/WorkspaceSidebar";
import { EditorTabs } from "../features/workspace/EditorTabs";
import "../features/workspace/workspace.css";

export const Route = createFileRoute("/_auth/workspace/$workspaceId")({
  component: WorkspaceLayout,
});

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

const MIN_CHAT_WIDTH = 280;
const MAX_CHAT_WIDTH = 600;
const DEFAULT_CHAT_WIDTH = 360;

function WorkspaceLayout() {
  const { workspaceId } = useParams({
    from: "/_auth/workspace/$workspaceId",
  });
  const { setCurrentWorkspaceId } = useWorkspacesContext();

  // Chat panel resize state
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = containerRect.right - e.clientX;
      setChatWidth(
        Math.min(MAX_CHAT_WIDTH, Math.max(MIN_CHAT_WIDTH, newWidth))
      );
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging]);

  // Set the current workspace when this view loads
  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId);
    }
    return () => {
      setCurrentWorkspaceId(null);
    };
  }, [workspaceId, setCurrentWorkspaceId]);

  return (
    <motion.div
      className="workspace-detail-view"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="workspace-unified-container" ref={containerRef}>
        {/* Left Panel: Workspace Identity + File System */}
        <WorkspaceSidebar />

        {/* Middle Panel: Editor with Tabs */}
        <main className="workspace-panel workspace-editor">
          <EditorTabs />
          <div className="editor-container">
            <Outlet />
          </div>
        </main>

        {/* Right Panel: Contextual Chat */}
        <div
          className={`workspace-panel workspace-chat-sidebar ${
            !isChatOpen ? "workspace-chat-collapsed" : ""
          }`}
          style={isChatOpen ? { width: chatWidth } : undefined}
          onClick={!isChatOpen ? () => setIsChatOpen(true) : undefined}
        >
          {isChatOpen ? (
            <>
              <div
                className={`chat-resize-handle ${isDragging ? "dragging" : ""}`}
                onMouseDown={handleMouseDown}
              />
              <ChatPane
                onCollapse={() => setIsChatOpen(false)}
                workspaceId={workspaceId}
              />
            </>
          ) : (
            <div className="chat-collapsed-icon" title="Open Chat">
              <MessageSquare size={20} strokeWidth={2} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
