import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { ParticleBackground } from "../components/ParticleBackground";
import { PreviewProvider } from "../contexts/PreviewContext";
import {
  PreviewNavigationProvider,
  usePreviewNavigationContext,
} from "../contexts/PreviewNavigationContext";
import { CreateWorkspaceView } from "../components/CreateWorkspaceView";
import { WorkspaceDetailView } from "../components/WorkspaceDetailView";
import { WorkspacesListView } from "../components/WorkspacesListView";
import { Navbar } from "../components/Navbar";
import { PreviewHomeView } from "../components/PreviewHomeView";
import { PreviewChatView } from "../components/PreviewChatView";
import { ExtensionsView } from "../components/ExtensionsView";
import { usePreviewChat } from "../hooks/chat/usePreviewChat";
import type { User } from "../lib/api";
import "../styles/preview.css";

interface DashboardPageProps {
  user: User;
}

export function DashboardPage({ user: _user }: DashboardPageProps) {
  return (
    <PreviewNavigationProvider>
      <PreviewProvider>
        <DashboardContent />
      </PreviewProvider>
    </PreviewNavigationProvider>
  );
}

function DashboardContent() {
  const { current, push, pop, reset, canPop } = usePreviewNavigationContext();
  const currentView = current.view;
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

      {/* Dashboard Navbar with logout */}
      <Navbar
        onHomeClick={() => {
          exitChatMode();
          reset();
        }}
        onWorkspacesClick={() => {
          exitChatMode();
          push("workspaces-list");
        }}
        onExtensionsClick={() => {
          exitChatMode();
          push("extensions-list");
        }}
        variant="absolute"
      />

      {/* Main content */}
      <motion.div
        className={`preview-content ${isChatMode ? "chat-active" : ""} view-${currentView}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {canPop && (
            <motion.div
              className="back-button-row"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: "hidden" }}
            >
              <motion.button
                className="back-button"
                onClick={pop}
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

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
          ) : currentView === "extensions-list" ? (
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
