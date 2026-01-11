import {
  createFileRoute,
  Outlet,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { PresenceProvider } from "../contexts/PresenceContext";
import { WorkspacesProvider } from "../contexts/WorkspacesContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { EditorProvider } from "../contexts/EditorContext";
import { ParticleBackground } from "../features/landing/ParticleBackground";
import { Navbar } from "../components/common/Navbar";
import { PreviewChatView } from "../features/landing/PreviewChatView";
import { usePreviewChat } from "../hooks/chat/usePreviewChat";
import "../features/dashboard/dashboard.css";
import "../components/common/common.css";

export const Route = createFileRoute("/_auth")({
  component: AuthLayout,
});

function AuthLayout() {
  return (
    <PresenceProvider>
      <WorkspacesProvider>
        <DocumentsProvider>
          <CollaborationProvider>
            <EditorProvider>
              <DashboardChrome />
            </EditorProvider>
          </CollaborationProvider>
        </DocumentsProvider>
      </WorkspacesProvider>
    </PresenceProvider>
  );
}

function DashboardChrome() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    isChatMode,
    selectedAgent,
    chatInput,
    setChatInput,
    messages,
    exitChatMode,
    sendMessage,
  } = usePreviewChat();

  const pathname = location.pathname;
  const isWorkspaceRoute = pathname.startsWith("/workspace/");
  const isHome = pathname === "/";
  const canGoBack = !isHome && !isWorkspaceRoute;

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

  const getViewClass = () => {
    if (isWorkspaceRoute) return "workspace-detail";
    if (pathname === "/workspaces") return "workspaces-list";
    if (pathname === "/workspaces/new") return "create-workspace";
    if (pathname === "/extensions") return "extensions-list";
    return "home";
  };

  // Workspace routes render with just navbar (they have their own layout for the rest)
  if (isWorkspaceRoute) {
    return (
      <div className="workspace-page">
        <Navbar
          onHomeClick={() => navigate({ to: "/" })}
          onWorkspacesClick={() => navigate({ to: "/workspaces" })}
          onExtensionsClick={() => navigate({ to: "/extensions" })}
          variant="absolute"
        />
        <Outlet />
      </div>
    );
  }

  return (
    <div
      className={`preview-container ${isChatMode ? "chat-active" : ""} view-${getViewClass()}`}
      style={
        isChatMode
          ? ({
              backgroundColor: `${selectedAgent.color}15`,
              "--preview-bg": `${selectedAgent.color}10`,
            } as React.CSSProperties)
          : {}
      }
    >
      <ParticleBackground />

      <Navbar
        onHomeClick={() => {
          exitChatMode();
          navigate({ to: "/" });
        }}
        onWorkspacesClick={() => {
          exitChatMode();
          navigate({ to: "/workspaces" });
        }}
        onExtensionsClick={() => {
          exitChatMode();
          navigate({ to: "/extensions" });
        }}
        variant="absolute"
      />

      <motion.div
        className={`preview-content ${isChatMode ? "chat-active" : ""} view-${getViewClass()}`}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {(canGoBack || isChatMode) && (
            <motion.div
              className={`back-button-row ${isChatMode ? "chat-back-row" : ""}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <motion.button
                className="back-button"
                onClick={
                  isChatMode ? exitChatMode : () => window.history.back()
                }
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
          {isHome && isChatMode ? (
            <PreviewChatView
              key="chat-view"
              messages={messages}
              selectedAgent={selectedAgent}
              chatInput={chatInput}
              setChatInput={setChatInput}
              sendMessage={sendMessage}
            />
          ) : (
            <Outlet />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
