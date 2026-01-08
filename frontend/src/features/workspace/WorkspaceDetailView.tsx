import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { useEditorContext } from "../../contexts/EditorContext";
import { useDocumentsContext } from "../../contexts/DocumentsContext";
import { useWorkspacesContext } from "../../contexts/WorkspacesContext";
import { useDashboardNavigationContext } from "../../contexts/DashboardNavigationContext";
import { ChatPane } from "./ChatPane";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { EditorTabs } from "./EditorTabs";
import "./workspace.css";

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0 },
};

export const WorkspaceDetailView: React.FC = () => {
  const { activeDocumentId } = useEditorContext();
  const { documents } = useDocumentsContext();
  const { current } = useDashboardNavigationContext();
  const { setCurrentWorkspaceId } = useWorkspacesContext();

  // Set the current workspace when this view loads
  useEffect(() => {
    const wsId = current.workspaceId;
    if (wsId) {
      setCurrentWorkspaceId(String(wsId));
    }
    return () => {
      // Clear workspace when leaving this view
      setCurrentWorkspaceId(null);
    };
  }, [current.workspaceId, setCurrentWorkspaceId]);

  const activeDocument = activeDocumentId
    ? documents.find((d) => d.id === activeDocumentId)
    : null;

  return (
    <motion.div
      className="workspace-detail-view"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="workspace-unified-container">
        {/* Left Panel: Workspace Identity + File System */}
        <WorkspaceSidebar />

        {/* Middle Panel: Collaborative Editor */}
        <main className="workspace-panel workspace-editor">
          <EditorTabs />
          {activeDocument ? (
            <div className="editor-container">
              <CollaborativeEditor docId={activeDocument.id} />
            </div>
          ) : (
            <div className="editor-empty-state">
              <div className="empty-icon">
                <FileText size={48} strokeWidth={1} />
              </div>
              <h3>Select a document</h3>
              <p>Pick a document from the sidebar to start working</p>
            </div>
          )}
        </main>

        {/* Right Panel: Contextual Chat */}
        <div className="workspace-panel workspace-chat-sidebar">
          <ChatPane />
        </div>
      </div>
    </motion.div>
  );
};
