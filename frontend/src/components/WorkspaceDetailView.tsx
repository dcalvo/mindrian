import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Search,
  Folder,
  File,
  Plus,
  Send,
  MoreVertical,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { usePreview } from "../contexts/PreviewContext";

// BlockNote Imports
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

export const WorkspaceDetailView: React.FC = () => {
  const { activeWorkspace, activeDocument, selectDocument } = usePreview();
  const [chatInput, setChatInput] = useState("");
  const [isFilesExpanded, setIsFilesExpanded] = useState(true);

  // Initialize BlockNote
  const editor = useCreateBlockNote();

  if (!activeWorkspace) return null;

  const Icon = activeWorkspace.icon;
  const documents = activeWorkspace.documents || [];

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
        <aside className="workspace-panel workspace-sidebar">
          <div className="sidebar-section">
            <div
              className="sidebar-header"
              onClick={() => setIsFilesExpanded(!isFilesExpanded)}
            >
              <div className="sidebar-header-left">
                {isFilesExpanded ? (
                  <ChevronDown size={14} />
                ) : (
                  <ChevronRight size={14} />
                )}
                <Folder size={16} />
                <span>Documents</span>
              </div>
              <button
                className="add-file-btn"
                onClick={(e) => e.stopPropagation()}
              >
                <Plus size={14} />
              </button>
            </div>

            <AnimatePresence>
              {isFilesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="file-list"
                >
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className={`file-item ${activeDocument?.id === doc.id ? "active" : ""}`}
                      onClick={() => selectDocument(doc.id)}
                    >
                      <File size={14} />
                      <span className="file-name">{doc.title}</span>
                    </div>
                  ))}
                  {documents.length === 0 && (
                    <div className="empty-files-hint">No documents yet</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Middle Panel: BlockNote Editor */}
        <main className="workspace-panel workspace-editor">
          {activeDocument ? (
            <div className="editor-container">
              <div className="editor-scroll-area">
                <input
                  type="text"
                  className="editor-title-input"
                  defaultValue={activeDocument.title}
                />
                <div className="editor-meta">
                  Last updated {activeDocument.updatedAt}
                </div>
                <div className="blocknote-wrapper">
                  <BlockNoteView editor={editor} theme="light" />
                </div>
              </div>
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
        <aside className="workspace-panel workspace-chat-sidebar">
          <div className="workspace-chat-header">
            <h3>Workspace Assistant</h3>
          </div>
          <div className="workspace-chat-messages">
            <div className="system-msg">
              Assistant ready for {activeWorkspace.name}. How can I help?
            </div>
          </div>
          <div className="workspace-chat-input-area">
            <div className="chat-input-pill">
              <input
                type="text"
                placeholder="Ask anything..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />
              <button className="chat-send-btn">
                <Send size={14} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
