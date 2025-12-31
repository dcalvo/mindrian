import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  ChevronDown,
  ArrowLeft,
  FileText,
  Briefcase,
  TrendingUp,
  Code,
  BookOpen,
  ChevronRight,
  Home,
  Blocks,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { ParticleBackground } from "../components/ParticleBackground";
import "../styles/preview.css";

const NavItem = ({ icon: Icon, label }: { icon: any; label: string }) => {
  return (
    <motion.div
      className="nav-item"
      whileHover="hover"
      initial="rest"
      animate="rest"
    >
      <div className="nav-icon-wrapper">
        <Icon size={20} />
      </div>
      <motion.span
        className="nav-label"
        variants={{
          rest: { opacity: 0, x: -10, pointerEvents: "none" },
          hover: { opacity: 1, x: 0, pointerEvents: "auto" },
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export function PreviewLanding() {
  const agents = [
    {
      id: "larry",
      name: "Larry",
      description: "Creative Strategist",
      color: "#3b82f6",
    },
    {
      id: "sagir",
      name: "Sagir",
      description: "Technical Expert",
      color: "#10b981",
    },
    {
      id: "Calvo",
      name: "Calvo",
      description: "Business Advisor",
      color: "#8b5cf6",
    },
  ];

  const workspaces = [
    {
      id: 1,
      name: "Product Design",
      icon: Briefcase,
      documentCount: 24,
      bgColor: "#000000",
      iconColor: "#ffffff",
    },
    {
      id: 2,
      name: "Marketing Strategy",
      icon: TrendingUp,
      documentCount: 15,
      bgColor: "#ffffff",
      iconColor: "#000000",
    },
    {
      id: 3,
      name: "Engineering Docs",
      icon: Code,
      documentCount: 42,
      bgColor: "#000000",
      iconColor: "#ffffff",
    },
    {
      id: 4,
      name: "Personal Notes",
      icon: BookOpen,
      documentCount: 31,
      bgColor: "#ffffff",
      iconColor: "#000000",
    },
  ];

  const [isChatMode, setIsChatMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<
    { sender: "agent" | "user"; text: string }[]
  >([]);

  const enterChatMode = () => {
    if (!isChatMode) {
      setIsChatMode(true);
      if (messages.length === 0) {
        setMessages([
          {
            sender: "agent",
            text: `Hey there! I'm ${selectedAgent.name}. How can I help you today?`,
          },
        ]);
      }
    }
  };

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

  const itemVariants: Variants = {
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

  return (
    <div
      className={`preview-container ${isChatMode ? "chat-active" : ""}`}
      style={
        isChatMode
          ? ({
              backgroundColor: `${selectedAgent.color}15`,
              "--preview-bg": `${selectedAgent.color}10`,
            } as React.CSSProperties)
          : {}
      }
    >
      {/* Physics-based Particle Background */}
      <ParticleBackground />

      {/* Centered Preview Navbar */}
      <div className="preview-nav-wrapper">
        <div className="preview-nav">
          <NavItem icon={Home} label="Home" />
          <NavItem icon={LayoutDashboard} label="Workspaces" />
          <NavItem icon={Blocks} label="Extensions" />
          <NavItem icon={Settings} label="Settings" />
        </div>
      </div>

      {/* Back button */}
      <Link
        to="/"
        className="back-link"
        onClick={(e) => {
          if (isChatMode) {
            e.preventDefault();
            setIsChatMode(false);
            setMessages([]); // Clear messages when leaving
          }
        }}
      >
        <motion.div
          className="back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </motion.div>
      </Link>

      {/* Main content */}
      <motion.div
        className={`preview-content ${isChatMode ? "chat-active" : ""}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {!isChatMode ? (
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
                    Welcome to
                  </motion.span>
                  <motion.span
                    className="brand-name"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                  >
                    Mindrian
                  </motion.span>
                </h1>
                <motion.p
                  className="welcome-subtitle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  Your intelligent workspace for thinking, creating, and
                  collaborating.
                </motion.p>
              </motion.div>

              {/* Action buttons */}
              <motion.div className="actions-section" variants={itemVariants}>
                <motion.button
                  className="action-button primary-action"
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
            </motion.div>
          ) : (
            <motion.div
              key="chat-messages-view"
              className="chat-messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    className={`message ${msg.sender}`}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    {msg.sender === "agent" && (
                      <div
                        className="message-avatar"
                        style={{ backgroundColor: selectedAgent.color }}
                      >
                        {selectedAgent.name[0]}
                      </div>
                    )}
                    <div className="message-bubble">{msg.text}</div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="chat-action-container" style={{ width: "100%" }}>
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
              onBlur={(e) => {
                // If clicking outside the chat wrapper and input is empty, exit chat mode
                const currentTarget = e.currentTarget;
                setTimeout(() => {
                  if (
                    !currentTarget.parentElement?.contains(
                      document.activeElement
                    ) &&
                    !chatInput.trim() &&
                    messages.length <= 1 // Only if just the intro message is present
                  ) {
                    setIsChatMode(false);
                    setMessages([]);
                  }
                }, 100);
              }}
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
                          <span className="agent-option-name">
                            {agent.name}
                          </span>
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
                onClick={() => {
                  if (chatInput.trim()) {
                    setMessages((prev) => [
                      ...prev,
                      { sender: "user", text: chatInput },
                    ]);
                    setChatInput("");
                  }
                }}
              >
                <ChevronRight size={18} />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Your Workspaces Section */}
        <AnimatePresence>
          {!isChatMode && (
            <motion.div
              key="workspaces"
              className="workspaces-section"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={containerVariants}
            >
              <h2 className="workspaces-title">Your Workspaces</h2>
              <div className="workspaces-grid">
                {workspaces.map((workspace, index) => (
                  <motion.div
                    key={workspace.id}
                    className="workspace-card"
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
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
