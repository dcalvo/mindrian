import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
const fs = window.fs;

export interface WorkspaceConfig {
  title: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  createdAt: string;
}

export interface Workspace extends WorkspaceConfig {
  id: string; // folder name
  path: string; // full path
  updated_at: string; // derived from fs stats
}

interface WorkspacesContextType {
  workspaces: Workspace[];
  loading: boolean;
  error: string | null;
  currentWorkspaceId: string | null;
  setCurrentWorkspaceId: (id: string | null) => void;
  refreshWorkspaces: () => Promise<void>;
  createWorkspace: (
    title: string,
    icon: string,
    bgColor: string,
    iconColor: string
  ) => Promise<Workspace>;
  deleteWorkspace: (id: string) => Promise<void>;
}

export const WorkspacesContext = createContext<
  WorkspacesContextType | undefined
>(undefined);

export const WorkspacesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    null
  );

  const getMindrianDir = async () => {
    const dir = await fs.getMindrianDir();
    if (!(await fs.exists(dir))) {
      await fs.createDir(dir);
    }
    return dir;
  };

  const refreshWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      const rootDir = await getMindrianDir();
      const entries = await fs.readDir(rootDir);

      const workspacePromises = entries
        .filter((e) => e.isDirectory && !e.name.startsWith("."))
        .map(async (entry) => {
          const wsPath = `${rootDir}/${entry.name}`;
          const configPath = `${wsPath}/.mindrian/config.json`;
          const stats = await fs.getStats(wsPath);

          let config: WorkspaceConfig;
          try {
            const content = await fs.readFile(configPath);
            config = JSON.parse(content);
          } catch {
            // Default config for folders without metadata
            config = {
              title: entry.name,
              icon: "briefcase",
              bgColor: "#000000",
              iconColor: "#ffffff",
              createdAt: stats.birthtime.toISOString(),
            };
          }

          return {
            ...config,
            id: entry.name,
            path: wsPath,
            updated_at: stats.mtime.toISOString(),
          } as Workspace;
        });

      const loadedWorkspaces = await Promise.all(workspacePromises);
      // Sort by updated_at desc
      loadedWorkspaces.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      setWorkspaces(loadedWorkspaces);
      setError(null);
    } catch (err) {
      console.error("Failed to load workspaces:", err);
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  const createWorkspace = useCallback(
    async (title: string, icon: string, bgColor: string, iconColor: string) => {
      try {
        const rootDir = await getMindrianDir();
        // Sanitize title for folder name
        const folderName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        let uniqueName = folderName;
        let counter = 1;

        while (await fs.exists(`${rootDir}/${uniqueName}`)) {
          uniqueName = `${folderName}_${counter}`;
          counter++;
        }

        const wsPath = `${rootDir}/${uniqueName}`;
        const configPath = `${wsPath}/.mindrian`;

        await fs.createDir(wsPath);
        await fs.createDir(configPath);

        const config: WorkspaceConfig = {
          title,
          icon,
          bgColor,
          iconColor,
          createdAt: new Date().toISOString(),
        };

        await fs.writeFile(
          `${configPath}/config.json`,
          JSON.stringify(config, null, 2)
        );

        // Refresh to get the full object with stats
        await refreshWorkspaces();

        return {
          ...config,
          id: uniqueName,
          path: wsPath,
          updated_at: new Date().toISOString(),
        };
      } catch (err) {
        console.error("Failed to create workspace:", err);
        throw err;
      }
    },
    [refreshWorkspaces]
  );

  const deleteWorkspace = useCallback(
    async (id: string) => {
      try {
        const rootDir = await getMindrianDir();
        await fs.delete(`${rootDir}/${id}`);
        setWorkspaces((prev) => prev.filter((w) => w.id !== id));
        if (currentWorkspaceId === id) {
          setCurrentWorkspaceId(null);
        }
      } catch (err) {
        console.error("Failed to delete workspace:", err);
        throw err;
      }
    },
    [currentWorkspaceId]
  );

  return (
    <WorkspacesContext.Provider
      value={{
        workspaces,
        loading,
        error,
        currentWorkspaceId,
        setCurrentWorkspaceId,
        refreshWorkspaces,
        createWorkspace,
        deleteWorkspace,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
};

export const useWorkspacesContext = () => {
  const context = useContext(WorkspacesContext);
  if (context === undefined) {
    throw new Error(
      "useWorkspacesContext must be used within a WorkspacesProvider"
    );
  }
  return context;
};
