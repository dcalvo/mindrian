import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { ParticleBackground } from "../landing/ParticleBackground";
import { EditorProvider } from "../../contexts/EditorContext";
import {
  DashboardNavigationProvider,
  useDashboardNavigationContext,
} from "../../contexts/DashboardNavigationContext";
import { CreateWorkspaceView } from "./CreateWorkspaceView";
import { WorkspaceDetailView } from "../workspace/WorkspaceDetailView";
import { WorkspacesListView } from "./WorkspacesListView";
import { WorkspacesProvider } from "../../contexts/WorkspacesContext";
import { Navbar } from "../../components/common/Navbar";
import { PreviewHomeView } from "../landing/PreviewHomeView";
import { PreviewChatView } from "../landing/PreviewChatView";
import { ExtensionsView } from "../workspace/ExtensionsView";
import { usePreviewChat } from "../../hooks/chat/usePreviewChat";
import type { User } from "../../lib/api";
import "./dashboard.css";
import "../../components/common/common.css";

interface DashboardPageProps {
  user: User;
}

export function DashboardPage({ user: _user }: DashboardPageProps) {
  return (
    <DashboardNavigationProvider>
      <WorkspacesProvider>
        <EditorProvider>
          <DashboardContent />
        </EditorProvider>
      </WorkspacesProvider>
    </DashboardNavigationProvider>
  );
}

function DashboardContent() {
  const { current, push, pop, reset, canPop } = useDashboardNavigationContext();
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
          {(canPop || isChatMode) && currentView !== "workspace-detail" && (
            <motion.div
              className={`back-button-row ${isChatMode ? "chat-back-row" : ""}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <motion.button
                className="back-button"
                onClick={isChatMode ? exitChatMode : pop}
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
