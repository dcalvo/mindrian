import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { Channel } from "phoenix";
import {
  listAll,
  createDocument,
  createFolder,
  updateDocument,
  updateFolder,
  moveDocument as apiMoveDocument,
  moveFolder as apiMoveFolder,
  deleteItem,
  getMe,
  type Document,
  type Folder,
  type FileSystemItem,
} from "../lib/api";
import { getSocket } from "../lib/socket";
import { toast } from "sonner";
import { createContext, useContext } from "react";
import { useWorkspacesContext } from "./WorkspacesContext";

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

export function useDocumentsContext() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error(
      "useDocumentsContext must be used within a DocumentsProvider"
    );
  }
  return context;
}

// Helper hook to safely get workspace ID (handles case where WorkspacesProvider might not be available)
function useWorkspaceIdSafe(): string | null {
  try {
    const { currentWorkspaceId } = useWorkspacesContext();
    return currentWorkspaceId;
  } catch {
    // WorkspacesContext not available (e.g., DocumentsProvider is outside WorkspacesProvider)
    return null;
  }
}

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const currentWorkspaceId = useWorkspaceIdSafe();

  useEffect(() => {
    let cancelled = false;

    // Clear state immediately when workspace changes
    setFolders([]);
    setDocuments([]);
    setLoading(true);

    const setup = async () => {
      try {
        const user = await getMe();
        if (cancelled) return;

        const socket = getSocket();
        const channel = socket.channel(`documents:${user.id}`);

        // Folder events
        channel.on("folder_created", ({ folder }) => {
          setFolders((prev) => {
            if (prev.some((f) => f.id === folder.id)) return prev;
            return [...prev, folder];
          });
        });

        channel.on("folder_updated", ({ folder }) => {
          setFolders((prev) =>
            prev.map((f) => (f.id === folder.id ? folder : f))
          );
        });

        channel.on("folder_moved", ({ folder }) => {
          setFolders((prev) =>
            prev.map((f) => (f.id === folder.id ? folder : f))
          );
        });

        channel.on("folder_deleted", ({ id }) => {
          setFolders((prev) => prev.filter((f) => f.id !== id));
        });

        // Document events
        channel.on("document_created", ({ document }) => {
          setDocuments((prev) => {
            if (prev.some((d) => d.id === document.id)) return prev;
            return [...prev, document];
          });
        });

        channel.on("document_updated", ({ document }) => {
          setDocuments((prev) =>
            prev.map((d) => (d.id === document.id ? document : d))
          );
        });

        channel.on("document_moved", ({ document }) => {
          setDocuments((prev) =>
            prev.map((d) => (d.id === document.id ? document : d))
          );
        });

        channel.on("document_deleted", ({ id }) => {
          setDocuments((prev) => prev.filter((d) => d.id !== id));
        });

        await new Promise<void>((resolve, reject) => {
          channel
            .join()
            .receive("ok", () => resolve())
            .receive("error", (err) => reject(new Error(JSON.stringify(err))))
            .receive("timeout", () =>
              reject(new Error("Channel join timeout"))
            );
        });

        channelRef.current = channel;

        if (cancelled) {
          channel.leave();
          channelRef.current = null;
          return;
        }

        const data = await listAll(currentWorkspaceId || undefined);
        if (cancelled) return;

        setFolders(data.folders);
        setDocuments(data.documents);
        setLoading(false);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load documents"
          );
          setLoading(false);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.leave();
        channelRef.current = null;
      }
    };
  }, [currentWorkspaceId]);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listAll(currentWorkspaceId || undefined);
      setFolders(data.folders);
      setDocuments(data.documents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [currentWorkspaceId]);

  const getUniqueFolderName = useCallback(
    (baseName: string, parentFolderId: string | null) => {
      const siblings = folders.filter(
        (f) => f.parent_folder_id === parentFolderId
      );
      const siblingNames = new Set(siblings.map((f) => f.title.toLowerCase()));

      if (!siblingNames.has(baseName.toLowerCase())) {
        return baseName;
      }

      let counter = 1;
      while (true) {
        const newName = `${baseName} (${counter})`;
        if (!siblingNames.has(newName.toLowerCase())) {
          return newName;
        }
        counter++;
      }
    },
    [folders]
  );

  const getUniqueDocumentName = useCallback(
    (baseName: string, folderId: string | null) => {
      const siblings = documents.filter((d) => d.folder_id === folderId);
      const siblingNames = new Set(siblings.map((d) => d.title.toLowerCase()));

      if (!siblingNames.has(baseName.toLowerCase())) {
        return baseName;
      }

      let counter = 1;
      while (true) {
        const newName = `${baseName} (${counter})`;
        if (!siblingNames.has(newName.toLowerCase())) {
          return newName;
        }
        counter++;
      }
    },
    [documents]
  );

  const addDocument = useCallback(
    async (title: string = "Untitled", folderId?: string | null) => {
      const uniqueTitle = getUniqueDocumentName(title, folderId || null);
      return await createDocument(
        uniqueTitle,
        folderId,
        currentWorkspaceId || undefined
      );
    },
    [getUniqueDocumentName, currentWorkspaceId]
  );

  const addFolder = useCallback(
    async (title: string = "New Folder", parentFolderId?: string | null) => {
      const uniqueTitle = getUniqueFolderName(title, parentFolderId || null);
      return await createFolder(
        uniqueTitle,
        parentFolderId,
        currentWorkspaceId || undefined
      );
    },
    [getUniqueFolderName, currentWorkspaceId]
  );

  const renameItem = useCallback(
    async (
      id: string,
      title: string,
      isFolder: boolean
    ): Promise<FileSystemItem> => {
      if (isFolder) {
        return await updateFolder(id, title);
      } else {
        return await updateDocument(id, title);
      }
    },
    []
  );

  const moveItem = useCallback(
    async (
      id: string,
      parentId: string | null,
      position: number,
      isFolder: boolean
    ): Promise<FileSystemItem> => {
      // Optimistic update
      if (isFolder) {
        setFolders((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, parent_folder_id: parentId, position } : f
          )
        );
      } else {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, folder_id: parentId, position } : d
          )
        );
      }

      try {
        if (isFolder) {
          return await apiMoveFolder(id, parentId, position);
        } else {
          return await apiMoveDocument(id, parentId, position);
        }
      } catch (err) {
        // Revert on error
        await refetch();
        toast.error("Failed to move item.");
        throw err;
      }
    },
    [refetch]
  );

  const removeItem = useCallback(async (id: string) => {
    await deleteItem(id);
  }, []);

  return (
    <DocumentsContext.Provider
      value={{
        folders,
        documents,
        loading,
        error,
        refetch,
        addDocument,
        addFolder,
        renameItem,
        moveItem,
        removeItem,
      }}
    >
      {children}
    </DocumentsContext.Provider>
  );
}
