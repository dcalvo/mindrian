import { createContext } from "react";
import type { Document } from "../lib/api";

export interface DocumentsContextValue {
  documents: Document[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addDocument: (title?: string, parentId?: string | null) => Promise<Document>;
  addFolder: (title?: string, parentId?: string | null) => Promise<Document>;
  renameDocument: (id: string, title: string) => Promise<Document>;
  moveDocument: (
    id: string,
    parentId: string | null,
    position: number
  ) => Promise<Document>;
  removeDocument: (id: string) => Promise<void>;
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(
  null
);
