import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, MessageSquare } from "lucide-react";
import { useParams } from "@tanstack/react-router";
import { useEditorContext } from "../../contexts/EditorContext";
import { useDocumentsContext } from "../../contexts/DocumentsContext";
import { useWorkspacesContext } from "../../contexts/WorkspacesContext";
import { ChatPane } from "./ChatPane";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { EditorTabs } from "./EditorTabs";
import "./workspace.css";

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

export const WorkspaceDetailView: React.FC = () => {
  const { activeDocumentId } = useEditorContext();
  const { documents } = useDocumentsContext();
  const { workspaceId } = useParams({ strict: false }) as {
    workspaceId?: string;
  };
  const { setCurrentWorkspaceId } = useWorkspacesContext();

  // Chat panel resize state
  const [chatWidth, setChatWidth] = useState(DEFAULT_CHAT_WIDTH);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle chat expansion
  const toggleChatExpand = useCallback(() => {
    setIsChatExpanded((prev) => !prev);
    if (!isChatOpen) setIsChatOpen(true);
  }, [isChatOpen]);

  // Handle resize drag
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  useEffect(() => {
    if (!isDragging || isChatExpanded) return;

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
  }, [isDragging, isChatExpanded]);

  // Set the current workspace when this view loads
  useEffect(() => {
    if (workspaceId) {
      setCurrentWorkspaceId(workspaceId);
    }
    return () => {
      // Clear workspace when leaving this view
      setCurrentWorkspaceId(null);
    };
  }, [workspaceId, setCurrentWorkspaceId]);

  const activeDocument = activeDocumentId
    ? documents.find((d) => d.id === activeDocumentId)
    : null;

  return (
    <motion.div
      className="workspace-detail-view"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div
        className={`workspace-unified-container ${
          isChatExpanded ? "chat-expanded" : ""
        }`}
        ref={containerRef}
      >
        {/* Left Panel: Workspace Identity + File System */}
        {!isChatExpanded && <WorkspaceSidebar />}

        {/* Middle Panel: Collaborative Editor */}
        {!isChatExpanded && (
          <main className="workspace-panel workspace-editor">
            <EditorTabs />
            {activeDocument ? (
              <div className="editor-container">
                <CollaborativeEditor
                  key={activeDocument.id}
                  docId={activeDocument.id}
                />
              </div>
            ) : (
              <div className="editor-empty-state">
                <div className="empty-icon">
                  <FileText size={48} strokeWidth={1} />
                </div>
                <h3>Select a document</h3>
                <p>Pick a document from the sidebar to start working</p>
              </div>
            )}
          </main>
        )}

        {/* Right Panel: Contextual Chat */}
        <div
          className={`workspace-panel workspace-chat-sidebar ${
            !isChatOpen ? "workspace-chat-collapsed" : ""
          } ${isChatExpanded ? "full-view" : ""}`}
          style={
            isChatOpen && !isChatExpanded ? { width: chatWidth } : undefined
          }
          onClick={!isChatOpen ? () => setIsChatOpen(true) : undefined}
        >
          {isChatOpen ? (
            <>
              {isChatOpen && !isChatExpanded && (
                <div
                  className={`chat-resize-handle ${
                    isDragging ? "dragging" : ""
                  }`}
                  onMouseDown={handleMouseDown}
                />
              )}
              <ChatPane
                onCollapse={() => setIsChatOpen(false)}
                onToggleExpand={toggleChatExpand}
                isExpanded={isChatExpanded}
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
};
