import { createContext } from "react";
import type { Folder, Document, FileSystemItem } from "../lib/api";

export interface DocumentsContextValue {
  folders: Folder[];
  documents: Document[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addDocument: (title?: string, folderId?: string | null) => Promise<Document>;
  addFolder: (
    title?: string,
    parentFolderId?: string | null
  ) => Promise<Folder>;
  renameItem: (
    id: string,
    title: string,
    isFolder: boolean
  ) => Promise<FileSystemItem>;
  moveItem: (
    id: string,
    parentId: string | null,
    position: number,
    isFolder: boolean
  ) => Promise<FileSystemItem>;
  removeItem: (id: string) => Promise<void>;
}

export const DocumentsContext = createContext<DocumentsContextValue | null>(
  null
);
