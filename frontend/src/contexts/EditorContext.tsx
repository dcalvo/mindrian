import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Document } from "../lib/api";
import { useWorkspacesContext } from "./WorkspacesContext";
import { useDocumentsContext } from "./DocumentsContext";

export interface EditorContextType {
  openDocuments: Document[];
  activeDocumentId: string | null;
  openDocument: (doc: Document) => void;
  closeDocument: (docId: string) => void;
  setActiveDocument: (docId: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [openDocuments, setOpenDocuments] = useState<Document[]>([]);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const { currentWorkspaceId } = useWorkspacesContext();
  const { documents } = useDocumentsContext();

  // Reset editor state when workspace changes
  useEffect(() => {
    setOpenDocuments([]);
    setActiveDocumentId(null);
  }, [currentWorkspaceId]);

  // Close tabs for deleted documents
  useEffect(() => {
    const documentIds = new Set(documents.map((d) => d.id));
    setOpenDocuments((prev) => {
      if (prev.length === 0) return prev;

      const filtered = prev.filter((d) => documentIds.has(d.id));
      if (filtered.length === prev.length) return prev;

      // If active document was closed, switch to another
      setActiveDocumentId((currentActive) => {
        if (currentActive && !documentIds.has(currentActive)) {
          return filtered.length > 0 ? filtered[filtered.length - 1].id : null;
        }
        return currentActive;
      });

      return filtered;
    });
  }, [documents]);

  const openDocument = useCallback((doc: Document) => {
    setOpenDocuments((prev) => {
      // Add if not already open
      if (!prev.find((d) => d.id === doc.id)) {
        return [...prev, doc];
      }
      return prev;
    });
    setActiveDocumentId(doc.id);
  }, []);

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
