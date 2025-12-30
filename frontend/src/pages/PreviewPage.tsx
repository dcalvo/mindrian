import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Plus,
  MessageSquare,
  ChevronDown,
  Sparkles,
  Brain,
  Zap,
  ArrowLeft,
} from "lucide-react";
import "../styles/preview.css";

export function PreviewLanding() {
  const agents = [
    { id: "claude", name: "Claude", description: "Anthropic's assistant" },
    { id: "gpt4", name: "GPT-4", description: "OpenAI's reasoning model" },
    { id: "gemini", name: "Gemini", description: "Google's multimodal AI" },
    {
      id: "mindrian",
      name: "Mindrian",
      description: "Your personal assistant",
    },
  ];

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(agents[3]);
  const [chatInput, setChatInput] = useState("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="preview-container">
      {/* Animated background elements */}
      <div className="preview-bg">
        <motion.div
          className="bg-blur bg-blur-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="bg-blur bg-blur-2"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        className="floating-icon floating-icon-1"
        variants={floatingVariants}
        animate="animate"
      >
        <Sparkles size={24} />
      </motion.div>
      <motion.div
        className="floating-icon floating-icon-2"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
      >
        <Brain size={28} />
      </motion.div>
      <motion.div
        className="floating-icon floating-icon-3"
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
      >
        <Zap size={20} />
      </motion.div>

      {/* Back button */}
      <Link to="/" className="back-link">
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
        className="preview-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Logo/Brand mark */}
        <motion.div className="brand-mark" variants={itemVariants}>
          <div className="brand-icon">
            <motion.div
              className="brand-inner"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="brand-square" />
            </motion.div>
          </div>
        </motion.div>

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
          {/* Create Workspace Button */}
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

          {/* Divider */}
          <div className="actions-divider">
            <span>or</span>
          </div>

          {/* Discuss with Agent */}
          <div className="chat-action-container">
            <motion.div
              className="chat-input-wrapper"
              whileHover={{ boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)" }}
            >
              <div className="chat-icon">
                <MessageSquare size={18} />
              </div>

              <input
                type="text"
                className="chat-input"
                placeholder={`Discuss with ${selectedAgent.name}...`}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
              />

              {/* Agent Dropdown */}
              <div className="agent-dropdown-container">
                <motion.button
                  className="agent-selector"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="agent-name">{selectedAgent.name}</span>
                  <motion.div
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    <ChevronDown size={16} />
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
            </motion.div>

            {/* Send button */}
            <motion.button
              className="send-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!chatInput.trim()}
            >
              <Sparkles size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="footer-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Press <kbd>⌘</kbd>
          <kbd>K</kbd> to open command palette
        </motion.p>
      </motion.div>
    </div>
  );
}
