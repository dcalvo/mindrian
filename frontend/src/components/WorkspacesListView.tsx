import React from "react";
import { motion, type Variants } from "framer-motion";
import { Plus, FileText, Clock } from "lucide-react";
import { usePreviewContext } from "../contexts/PreviewContext";
import { usePreviewNavigationContext } from "../contexts/PreviewNavigationContext";

interface WorkspacesListViewProps {
  itemVariants: Variants;
}

export const WorkspacesListView: React.FC<WorkspacesListViewProps> = ({
  itemVariants,
}) => {
  const { workspaces } = usePreviewContext();
  const { push } = usePreviewNavigationContext();

  return (
    <motion.div
      key="workspaces-list"
      className="workspaces-list-view"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        className="view-header"
        style={{
          marginBottom: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <motion.h1
            variants={itemVariants}
            className="view-title"
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              margin: 0,
              color: "var(--preview-text-primary)",
            }}
          >
            All Workspaces
          </motion.h1>
          <motion.p
            variants={itemVariants}
            style={{ color: "var(--preview-text-secondary)", marginTop: "8px" }}
          >
            Manage and organize your modular environments.
          </motion.p>
        </div>

        <motion.button
          variants={itemVariants}
          className="create-workspace-btn-small"
          onClick={() => push("create-workspace")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 20px",
            borderRadius: "12px",
            backgroundColor: "var(--preview-text-primary)",
            color: "var(--preview-bg)",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <Plus size={18} />
          <span>New Workspace</span>
        </motion.button>
      </div>

      <div className="workspaces-grid full-grid">
        {workspaces.map((workspace) => (
          <motion.div
            key={workspace.id}
            className="workspace-card"
            variants={itemVariants}
            onClick={() =>
              push("workspace-detail", { workspaceId: workspace.id })
            }
            whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
          >
            <div
              className="workspace-icon"
              style={{
                backgroundColor: workspace.bgColor,
                boxShadow: `0 8px 20px ${workspace.bgColor}33`,
              }}
            >
              <workspace.icon size={32} color={workspace.iconColor} />
            </div>
            <div className="workspace-info">
              <h3 className="workspace-name">{workspace.name}</h3>
              <div className="workspace-meta-row">
                <span className="workspace-meta">
                  <FileText size={12} />
                  {workspace.documentCount} docs
                </span>
                <span className="workspace-meta">
                  <Clock size={12} />
                  {workspace.lastUpdated}
                </span>
              </div>
            </div>

            {workspace.collaborators && workspace.collaborators.length > 0 && (
              <div className="workspace-collaborators">
                {workspace.collaborators.map((collab, i) => (
                  <div
                    key={i}
                    className="collab-avatar"
                    style={{ backgroundColor: collab.color }}
                    title={collab.name}
                  >
                    {collab.name[0]}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
