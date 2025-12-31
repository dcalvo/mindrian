import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ParticleBackground } from "../components/ParticleBackground";
import { PreviewProvider, usePreview } from "../contexts/PreviewContext";
import { CreateWorkspaceView } from "../components/CreateWorkspaceView";
import { WorkspaceDetailView } from "../components/WorkspaceDetailView";
import { WorkspacesListView } from "../components/WorkspacesListView";
import { PreviewNavbar } from "../components/PreviewNavbar";
import { PreviewHomeView } from "../components/PreviewHomeView";
import { PreviewChatView } from "../components/PreviewChatView";
import { ExtensionsView } from "../components/ExtensionsView";
import { usePreviewChat } from "../hooks/usePreviewChat";
import "../styles/preview.css";

export function PreviewLanding() {
  return (
    <PreviewProvider>
      <PreviewLandingContent />
    </PreviewProvider>
  );
}

function PreviewLandingContent() {
  const { currentView, setView } = usePreview();
  const {
    isChatMode,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedAgent,
    setSelectedAgent,
    chatInput,
    setChatInput,
    messages,
    enterChatMode,
    exitChatMode,
    sendMessage,
    handleBlur,
    agents,
  } = usePreviewChat();

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
      className={`preview-container ${isChatMode ? "chat-active" : ""} view-${currentView}`}
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
      <PreviewNavbar
        onHomeClick={() => {
          exitChatMode();
          setView("home");
        }}
        onWorkspacesClick={() => {
          exitChatMode();
          setView("workspaces-list");
        }}
        onExtensionsClick={() => {
          exitChatMode();
          setView("extensions-list");
        }}
      />

      {/* Back button */}
      <Link
        to="/"
        className="back-link"
        onClick={(e) => {
          if (isChatMode) {
            e.preventDefault();
            exitChatMode();
          } else if (currentView !== "home") {
            e.preventDefault();
            setView("home");
          }
        }}
      >
        <motion.div
          className="back-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft size={18} />
          <span>{currentView === "home" ? "Back" : "Home"}</span>
        </motion.div>
      </Link>

      {/* Main content */}
      <motion.div
        className={`preview-content ${isChatMode ? "chat-active" : ""} view-${currentView}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {currentView === "home" ? (
            !isChatMode ? (
              <PreviewHomeView
                key="home-view"
                itemVariants={itemVariants}
                isChatMode={isChatMode}
                isDropdownOpen={isDropdownOpen}
                setIsDropdownOpen={setIsDropdownOpen}
                selectedAgent={selectedAgent}
                setSelectedAgent={setSelectedAgent}
                chatInput={chatInput}
                setChatInput={setChatInput}
                enterChatMode={enterChatMode}
                handleBlur={handleBlur}
                sendMessage={sendMessage}
                agents={agents}
              />
            ) : (
              <PreviewChatView
                key="chat-view"
                messages={messages}
                selectedAgent={selectedAgent}
                chatInput={chatInput}
                setChatInput={setChatInput}
                sendMessage={sendMessage}
              />
            )
          ) : currentView === "workspaces-list" ? (
            <WorkspacesListView
              key="workspaces-list"
              itemVariants={itemVariants}
            />
          ) : currentView === "extensions-list" ? ( // Added ExtensionsView
            <ExtensionsView key="extensions-list" itemVariants={itemVariants} />
          ) : currentView === "create-workspace" ? (
            <CreateWorkspaceView key="create-workspace" />
          ) : currentView === "workspace-detail" ? (
            <WorkspaceDetailView key="workspace-detail" />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
