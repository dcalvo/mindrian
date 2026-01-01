import React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, ChevronDown, ChevronRight, FileText } from "lucide-react";
import { usePreview } from "../contexts/PreviewContext";
import type { Agent } from "../hooks/usePreviewChat";

interface PreviewHomeViewProps {
  itemVariants: Variants;
  isChatMode: boolean;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  selectedAgent: Agent;
  setSelectedAgent: (agent: Agent) => void;
  chatInput: string;
  setChatInput: (input: string) => void;
  enterChatMode: () => void;
  handleBlur: (e: React.FocusEvent) => void;
  sendMessage: () => void;
  agents: Agent[];
}

export const PreviewHomeView: React.FC<PreviewHomeViewProps> = ({
  itemVariants,
  isChatMode,
  isDropdownOpen,
  setIsDropdownOpen,
  selectedAgent,
  setSelectedAgent,
  chatInput,
  setChatInput,
  enterChatMode,
  handleBlur,
  sendMessage,
  agents,
}) => {
  const { workspaces, setView, selectWorkspace } = usePreview();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      key="landing-content"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
      style={{ width: "100%", display: "contents" }}
    >
      {/* Welcome text */}
      <motion.div className="welcome-section" variants={itemVariants}>
        <h1 className="welcome-title">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            Welcome
          </motion.span>
        </h1>
        <motion.p
          className="welcome-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          Your intelligent workspace for thinking, creating, and collaborating.
        </motion.p>
      </motion.div>

      {/* Action buttons */}
      <motion.div className="actions-section" variants={itemVariants}>
        <motion.button
          className="action-button primary-action"
          onClick={() => setView("create-workspace")}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
          }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="action-icon">
            <Plus size={20} />
          </div>
          <div className="action-content">
            <span className="action-title">Create Workspace</span>
            <span className="action-description">
              Start fresh with a new workspace
            </span>
          </div>
        </motion.button>

        <div className="actions-divider">
          <span>or</span>
        </div>
      </motion.div>

      {/* Chat Action Area */}
      <motion.div
        className="chat-action-container home-chat"
        variants={itemVariants}
      >
        <motion.div
          layout
          className={`chat-input-wrapper-new ${isChatMode ? "chat-active" : ""}`}
          whileHover={{ boxShadow: `0 8px 30px rgba(0, 0, 0, 0.08)` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <textarea
            className="chat-input"
            placeholder={`Discuss with ${selectedAgent.name}...`}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onFocus={enterChatMode}
            onBlur={handleBlur}
            rows={isChatMode ? 2 : 1}
          />

          {!isChatMode ? (
            <div className="agent-dropdown-container">
              <motion.button
                className="agent-selector"
                style={{ color: selectedAgent.color }}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.04)" }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="agent-name">{selectedAgent.name}</span>
                <motion.div
                  animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  style={{ color: selectedAgent.color }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    className="agent-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                  >
                    {agents.map((agent) => (
                      <motion.button
                        key={agent.id}
                        className={`agent-option ${selectedAgent.id === agent.id ? "selected" : ""}`}
                        style={
                          selectedAgent.id === agent.id
                            ? { color: agent.color }
                            : {}
                        }
                        onClick={() => {
                          setSelectedAgent(agent);
                          setIsDropdownOpen(false);
                        }}
                        whileHover={{
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        }}
                      >
                        <span className="agent-option-name">{agent.name}</span>
                        <span className="agent-option-desc">
                          {agent.description}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}

          <div className={isChatMode ? "chat-footer" : ""}>
            <motion.button
              className="send-button-inline"
              style={{ backgroundColor: selectedAgent.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!chatInput.trim()}
              onClick={sendMessage}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Workspaces Grid */}
      <motion.div
        key="workspaces"
        className="workspaces-section"
        variants={itemVariants}
      >
        <div
          className="section-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2 className="workspaces-title" style={{ margin: 0 }}>
            Recent Workspaces
          </h2>
          <motion.button
            className="see-all-btn"
            onClick={() => setView("workspaces-list")}
            whileHover={{ x: 3 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: "none",
              border: "none",
              color: "var(--preview-text-primary)",
              fontWeight: 600,
              fontSize: "0.9rem",
              cursor: "pointer",
              opacity: 0.8,
            }}
          >
            See all <ChevronRight size={16} />
          </motion.button>
        </div>
        <div className="workspaces-grid">
          {workspaces.map((workspace, index) => (
            <motion.div
              key={workspace.id}
              className="workspace-card"
              onClick={() => selectWorkspace(workspace.id)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.2 + index * 0.1,
                duration: 0.5,
              }}
            >
              <div
                className="workspace-icon"
                style={{
                  backgroundColor: workspace.bgColor,
                  boxShadow: `0 8px 20px ${workspace.bgColor}33`,
                }}
              >
                <workspace.icon size={28} color={workspace.iconColor} />
              </div>
              <div className="workspace-info">
                <h3 className="workspace-name">{workspace.name}</h3>
                <p className="workspace-meta">
                  <FileText size={12} />
                  {workspace.documentCount} documents
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
