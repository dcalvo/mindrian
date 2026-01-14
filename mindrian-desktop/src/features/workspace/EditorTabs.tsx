import React, { useRef, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useEditorContext } from "../../contexts/EditorContext";
import { useWorkspacesContext } from "../../contexts/WorkspacesContext";
import "./workspace.css";

const DocumentIcon = ({ active }: { active: boolean }) => {
  // We could determine icon based on extension or content, but for now generic
  return <FileText size={14} style={{ opacity: active ? 1 : 0.7 }} />;
};

export const EditorTabs: React.FC = () => {
  const { openDocuments, activeDocumentId, closeDocument, openDocument } =
    useEditorContext();
  const { currentWorkspaceId } = useWorkspacesContext();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    if (activeDocumentId && scrollContainerRef.current) {
      const activeTab = scrollContainerRef.current.querySelector(
        `.editor-tab[data-id="${activeDocumentId}"]`
      );
      if (activeTab) {
        activeTab.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [activeDocumentId, openDocuments.length]);

  if (openDocuments.length === 0) return null;

  return (
    <div className="editor-tabs-container">
      <div className="editor-tabs-scroll" ref={scrollContainerRef}>
        {openDocuments.map((doc) => {
          const isActive = doc.id === activeDocumentId;
          const isFile = doc.id.toLowerCase().endsWith(".pdf"); // Simple check for now

          return (
            <div
              key={doc.id}
              data-id={doc.id}
              className={`editor-tab ${isActive ? "active" : ""}`}
              onClick={() => {
                if (currentWorkspaceId) {
                  if (isFile) {
                    navigate({
                      to: "/workspace/$workspaceId/file/$fileId",
                      params: {
                        workspaceId: currentWorkspaceId,
                        fileId: encodeURIComponent(doc.id),
                      },
                    });
                  } else {
                    // Default to doc route
                    openDocument(doc);
                  }
                }
              }}
            >
              <span className="editor-tab-icon">
                <DocumentIcon active={isActive} />
              </span>
              <span className="editor-tab-title">{doc.title}</span>
              <button
                className="editor-tab-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeDocument(doc.id);
                  // If closing active file, maybe navigate away (EditorContext handles state, but not route in this case if we are on the file route)
                }}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
