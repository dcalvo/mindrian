import React from "react";
import { motion, type Variants } from "framer-motion";
import {
  Plus,
  FileText,
  Clock,
  Briefcase,
  TrendingUp,
  Code,
  BookOpen,
  Terminal,
  Cpu,
  Globe,
  Zap,
} from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useWorkspacesContext } from "../../contexts/WorkspacesContext";

const DEFAULT_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

interface WorkspacesListViewProps {
  itemVariants?: Variants;
}

export const WorkspacesListView: React.FC<WorkspacesListViewProps> = ({
  itemVariants = DEFAULT_ITEM_VARIANTS,
}) => {
  const { workspaces, loading } = useWorkspacesContext();
  const navigate = useNavigate();

  const getIcon = (iconId: string) => {
    switch (iconId) {
      case "briefcase":
        return Briefcase;
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
        return Briefcase;
    }
  };

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
          onClick={() => navigate({ to: "/workspaces/new" })}
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
        {loading && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "40px",
              color: "var(--preview-text-secondary)",
            }}
          >
            Loading workspaces...
          </div>
        )}
        {!loading && workspaces.length === 0 && (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "40px",
              color: "var(--preview-text-secondary)",
            }}
          >
            No workspaces found. Create one to get started.
          </div>
        )}
        {workspaces.map((workspace) => {
          const IconComponent = getIcon(workspace.icon);
          return (
            <motion.div
              key={workspace.id}
              className="workspace-card"
              variants={itemVariants}
              onClick={() =>
                navigate({
                  to: "/workspace/$workspaceId",
                  params: { workspaceId: String(workspace.id) },
                })
              }
              whileHover={{ y: -5, boxShadow: "0 12px 30px rgba(0,0,0,0.08)" }}
            >
              <div
                className="workspace-icon"
                style={{
                  backgroundColor: workspace.bg_color,
                  boxShadow: `0 8px 20px ${workspace.bg_color}33`,
                }}
              >
                <IconComponent size={32} color={workspace.icon_color} />
              </div>
              <div className="workspace-info">
                <h3 className="workspace-name">{workspace.title}</h3>
                <div className="workspace-meta-row">
                  <span className="workspace-meta">
                    <FileText size={12} />0 docs
                  </span>
                  <span className="workspace-meta">
                    <Clock size={12} />
                    {new Date(workspace.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Future: Collaborators
              {workspace.collaborators && workspace.collaborators.length > 0 && (
                <div className="workspace-collaborators">
                  {workspace.collaborators.map((collab: any, i: number) => (
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
              */}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
