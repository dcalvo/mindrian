import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { usePreviewContext } from "../contexts/PreviewContext";
import { FileTree } from "./FileTree";
import { ChatPane } from "./ChatPane";
import { CollaborativeEditor } from "./CollaborativeEditor";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

export const WorkspaceDetailView: React.FC = () => {
  const { activeWorkspace, activeDocument } = usePreviewContext();
  if (!activeWorkspace) return null;

  const Icon = activeWorkspace.icon;

  return (
    <motion.div
      className="workspace-detail-view"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="workspace-unified-container">
        {/* Left Panel: Workspace Identity + File System */}
        <aside className="workspace-panel workspace-sidebar">
          <div className="workspace-sidebar-identity">
            <div
              className="workspace-sidebar-icon"
              style={{ backgroundColor: activeWorkspace.bgColor }}
            >
              <Icon size={18} color={activeWorkspace.iconColor} />
            </div>
            <h1 className="workspace-sidebar-title">{activeWorkspace.name}</h1>
          </div>
          <div className="workspace-sidebar-divider" />
          <div className="workspace-sidebar-content">
            <FileTree />
          </div>
        </aside>

        {/* Middle Panel: Collaborative Editor */}
        <main className="workspace-panel workspace-editor">
          {activeDocument ? (
            <div className="editor-container">
              <CollaborativeEditor docId={activeDocument.id} />
            </div>
          ) : (
            <div className="editor-empty-state">
              <div className="empty-icon">
                <FileText size={48} strokeWidth={1} />
              </div>
              <h3>Select a document</h3>
              <p>Pick a document from the sidebar to start working</p>
              <button className="primary-action-btn">
                <Plus size={16} /> New Document
              </button>
            </div>
          )}
        </main>

        {/* Right Panel: Contextual Chat */}
        <div className="workspace-panel workspace-chat-sidebar">
          <ChatPane />
        </div>
      </div>
    </motion.div>
  );
};
