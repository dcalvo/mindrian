import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import { fs } from "../lib/fs";
import { useWorkspacesContext } from "./WorkspacesContext";
import { TreeNode } from "../lib/tree";

export interface LocalDocumentsContextValue {
  treeData: TreeNode[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  createDocument: (name: string, parentPath: string | null) => Promise<string>;
  createFolder: (name: string, parentPath: string | null) => Promise<string>;
  renameItem: (path: string, newName: string) => Promise<void>;
  deleteItem: (path: string) => Promise<void>;
  moveItem: (
    dragIds: string[],
    parentId: string | null,
    index: number
  ) => Promise<void>;
  importFiles: (
    filePaths: string[],
    targetFolder: string | null
  ) => Promise<void>;
}

export const LocalDocumentsContext = createContext<
  LocalDocumentsContextValue | undefined
>(undefined);

export const useDocumentsContext = () => {
  const context = useContext(LocalDocumentsContext);
  if (context === undefined) {
    throw new Error(
      "useDocumentsContext must be used within a LocalDocumentsProvider"
    );
  }
  return context;
};

export const LocalDocumentsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { workspaces, currentWorkspaceId } = useWorkspacesContext();
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentWorkspace = workspaces.find((w) => w.id === currentWorkspaceId);
  const workspacePath = currentWorkspace?.path;

  const buildFileTree = useCallback(
    async (dirPath: string): Promise<TreeNode[]> => {
      const entries = await fs.readDir(dirPath);

      const nodes: TreeNode[] = [];

      for (const entry of entries) {
        if (entry.name.startsWith(".")) continue; // skip dotfiles

        const fullPath = `${dirPath}/${entry.name}`;

        if (entry.isDirectory) {
          const children = await buildFileTree(fullPath);
          nodes.push({
            id: fullPath,
            name: entry.name,
            type: "folder",
            children,
            data: { id: fullPath, type: "folder", title: entry.name } as any, // Cast to match expected structure if needed, or update TreeNode types
          });
        } else {
          // Identify documents vs generic files
          const isJson = entry.name.endsWith(".json");
          // Skip workspace config
          if (entry.name === "config.json" && dirPath.endsWith(".mindrian"))
            continue;

          nodes.push({
            id: fullPath,
            name: entry.name,
            type: isJson ? "document" : ("file" as any), // "file" not in original type, we update TreeNode later
            data: {
              id: fullPath,
              type: isJson ? "document" : "file",
              title: entry.name,
              isAsset: !isJson,
            } as any,
          });
        }
      }

      // Sort: folders first, then files, alphabetically
      return nodes.sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === "folder" ? -1 : 1;
      });
    },
    []
  );

  const refresh = useCallback(async () => {
    if (!workspacePath) {
      setTreeData([]);
      return;
    }

    try {
      setLoading(true);
      const data = await buildFileTree(workspacePath);
      setTreeData(data);
      setError(null);
    } catch (err) {
      console.error("Failed to load file tree:", err);
      setError("Failed to load file tree");
    } finally {
      setLoading(false);
    }
  }, [workspacePath, buildFileTree]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  const createDocument = useCallback(
    async (name: string, parentPath: string | null) => {
      const basePath = parentPath || workspacePath;
      if (!basePath) throw new Error("No workspace selected");

      // Ensure .json extension
      const fileName = name.endsWith(".json") ? name : `${name}.json`;
      const fullPath = `${basePath}/${fileName}`;

      // Initial BlockNote content
      const initialContent: any[] = [];

      await fs.writeFile(fullPath, JSON.stringify(initialContent));
      await refresh();
      return fullPath;
    },
    [workspacePath, refresh]
  );

  const createFolder = useCallback(
    async (name: string, parentPath: string | null) => {
      const basePath = parentPath || workspacePath;
      if (!basePath) throw new Error("No workspace selected");

      const fullPath = `${basePath}/${name}`;
      await fs.createDir(fullPath);
      await refresh();
      return fullPath;
    },
    [workspacePath, refresh]
  );

  const renameItem = useCallback(
    async (path: string, newName: string) => {
      const parentDir = path.substring(0, path.lastIndexOf("/"));
      const newPath = `${parentDir}/${newName}`;
      await fs.rename(path, newPath);
      await refresh();
    },
    [refresh]
  );

  const deleteItem = useCallback(
    async (path: string) => {
      await fs.delete(path);
      await refresh();
    },
    [refresh]
  );

  const moveItem = useCallback(
    async (dragIds: string[], parentId: string | null, _index: number) => {
      const targetDir = parentId || workspacePath;
      if (!targetDir) return;

      for (const id of dragIds) {
        const fileName = id.substring(id.lastIndexOf("/") + 1);
        const newPath = `${targetDir}/${fileName}`;
        if (id !== newPath) {
          await fs.rename(id, newPath);
        }
      }
      await refresh();
    },
    [workspacePath, refresh]
  );

  const importFiles = useCallback(
    async (filePaths: string[], targetFolder: string | null) => {
      const destDir = targetFolder || workspacePath;
      if (!destDir) return;

      for (const srcPath of filePaths) {
        const fileName = srcPath.split("/").pop();
        if (!fileName) continue;

        let destPath = `${destDir}/${fileName}`;
        // Simple conflict resolution: if exists, append timestamp
        if (await fs.exists(destPath)) {
          const ext = fileName.includes(".")
            ? `.${fileName.split(".").pop()}`
            : "";
          const base = fileName.replace(ext, "");
          destPath = `${destDir}/${base}_${Date.now()}${ext}`;
        }

        await fs.copyFile(srcPath, destPath);
      }
      await refresh();
    },
    [workspacePath, refresh]
  );

  return (
    <LocalDocumentsContext.Provider
      value={{
        treeData,
        loading,
        error,
        refresh,
        createDocument,
        createFolder,
        renameItem,
        deleteItem,
        moveItem,
        importFiles,
      }}
    >
      {children}
    </LocalDocumentsContext.Provider>
  );
};
