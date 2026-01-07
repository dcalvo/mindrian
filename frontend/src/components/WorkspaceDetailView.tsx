import React from "react";
import { motion } from "framer-motion";
import { Search, MoreVertical, FileText, Plus } from "lucide-react";
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
      {/* Fixed Streamlined Header */}
      <header className="workspace-header">
        <div className="header-left">
          <div
            className="workspace-header-icon"
            style={{ backgroundColor: activeWorkspace.bgColor }}
          >
            <Icon size={20} color={activeWorkspace.iconColor} />
          </div>
          <div className="workspace-header-info">
            <h1 className="workspace-header-title">{activeWorkspace.name}</h1>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-btn">
            <Search size={18} />
          </button>
          <button className="header-btn">
            <MoreVertical size={18} />
          </button>
        </div>
      </header>

      {/* 3-Panel Content Area */}
      <div className="workspace-panels-layout">
        {/* Left Panel: File System */}
        <aside
          className="workspace-panel workspace-sidebar"
          style={{ paddingTop: "1rem" }}
        >
          <FileTree />
        </aside>

        {/* Middle Panel: Collaborative Editor */}
        <main className="workspace-panel workspace-editor">
          {activeDocument ? (
            <div
              className="editor-container"
              style={{ height: "100%", overflow: "hidden" }}
            >
              {/* CollaborativeEditor handles its own scroll and layout mostly, but we wrap it to be safe */}
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
