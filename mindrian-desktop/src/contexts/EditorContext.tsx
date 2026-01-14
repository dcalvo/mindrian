/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { useNavigate } from "@tanstack/react-router";
import { useWorkspacesContext } from "./WorkspacesContext";

export interface EditorDocument {
  id: string; // absolute path
  title: string;
  path: string;
}

export interface EditorContextType {
  openDocuments: EditorDocument[];
  activeDocumentId: string | null;
  openDocument: (doc: EditorDocument, shouldNavigate?: boolean) => void;
  closeDocument: (docId: string) => void;
  setActiveDocument: (docId: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openDocuments, setOpenDocuments] = useState<EditorDocument[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const { currentWorkspaceId } = useWorkspacesContext();
  const navigate = useNavigate();

  // Reset editor state when workspace changes
  useEffect(() => {
    setOpenDocuments([]);
    setActiveDocumentId(null);
  }, [currentWorkspaceId]);

  const openDocument = useCallback(
    (doc: EditorDocument, shouldNavigate = true) => {
      setOpenDocuments((prev) => {
        // Add if not already open
        if (!prev.find((d) => d.id === doc.id)) {
          return [...prev, doc];
        }
        return prev;
      });
      setActiveDocumentId(doc.id);
      if (shouldNavigate && currentWorkspaceId) {
        navigate({
          to: "/workspace/$workspaceId/doc/$docId",
          params: {
            workspaceId: currentWorkspaceId,
            docId: encodeURIComponent(doc.id),
          },
        });
      }
    },
    [navigate, currentWorkspaceId]
  );

  const closeDocument = useCallback((docId: string) => {
    setOpenDocuments((prev) => {
      const newDocs = prev.filter((d) => d.id !== docId);

      // If closing the active document, switch to another
      setActiveDocumentId((currentActive) => {
        if (currentActive === docId) {
          return newDocs.length > 0 ? newDocs[newDocs.length - 1].id : null;
        }
        return currentActive;
      });

      return newDocs;
    });
  }, []);

  const setActiveDocument = useCallback((docId: string) => {
    setActiveDocumentId(docId);
  }, []);

  return (
    <EditorContext.Provider
      value={{
        openDocuments,
        activeDocumentId,
        openDocument,
        closeDocument,
        setActiveDocument,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditorContext = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return context;
};
