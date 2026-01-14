import React, { useRef, useEffect } from "react";
import { X, FileText } from "lucide-react";
import { useEditorContext } from "../../contexts/EditorContext";
import "./workspace.css";

const DocumentIcon = ({ active }: { active: boolean }) => {
  // We could determine icon based on extension or content, but for now generic
  return <FileText size={14} style={{ opacity: active ? 1 : 0.7 }} />;
};

export const EditorTabs: React.FC = () => {
  const { openDocuments, activeDocumentId, closeDocument, openDocument } =
    useEditorContext();
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
          return (
            <div
              key={doc.id}
              data-id={doc.id}
              className={`editor-tab ${isActive ? "active" : ""}`}
              onClick={() => openDocument(doc)}
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
