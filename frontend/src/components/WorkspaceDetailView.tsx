import React from "react";
import { motion } from "framer-motion";
import { FileText, Plus, Search } from "lucide-react";
import { usePreview } from "../contexts/PreviewContext";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const WorkspaceDetailView: React.FC = () => {
  const { activeWorkspace } = usePreview();

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
      <header className="workspace-header">
        <div className="header-left">
          <motion.div
            className="workspace-header-icon"
            style={{ backgroundColor: activeWorkspace.bgColor }}
          >
            <Icon size={24} color={activeWorkspace.iconColor} />
          </motion.div>
          <div className="workspace-header-info">
            <h1 className="workspace-header-title">{activeWorkspace.name}</h1>
            <p className="workspace-header-meta">
              {activeWorkspace.documentCount} documents
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button className="header-btn">
            <Search size={18} />
          </button>
          <button className="header-btn primary">
            <Plus size={18} /> New Document
          </button>
        </div>
      </header>

      <section className="workspace-content-demo">
        <motion.div variants={ITEM_VARIANTS} className="empty-state-workspace">
          <div className="empty-illustration">
            <FileText size={48} strokeWidth={1} />
          </div>
          <h3>No documents yet</h3>
          <p>
            Start by creating your first document in {activeWorkspace.name}.
          </p>
          <button className="empty-action-btn">Create Document</button>
        </motion.div>
      </section>
    </motion.div>
  );
};
