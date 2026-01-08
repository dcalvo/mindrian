import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useCallback,
} from "react";
import {
  type Workspace,
  listWorkspaces,
  createWorkspace as apiCreateWorkspace,
  deleteWorkspace as apiDeleteWorkspace,
} from "../lib/api";

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

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(
  undefined
);

export const WorkspacesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState<string | null>(
    null
  );

  const refreshWorkspaces = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listWorkspaces();
      setWorkspaces(data);
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
        const newWorkspace = await apiCreateWorkspace(
          title,
          icon,
          bgColor,
          iconColor
        );
        setWorkspaces((prev) => [newWorkspace, ...prev]);
        return newWorkspace;
      } catch (err) {
        console.error("Failed to create workspace:", err);
        throw err;
      }
    },
    []
  );

  const deleteWorkspace = useCallback(async (id: string) => {
    try {
      await apiDeleteWorkspace(id);
      setWorkspaces((prev) => prev.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete workspace:", err);
      throw err;
    }
  }, []);

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
