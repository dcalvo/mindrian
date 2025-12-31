import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  Briefcase,
  TrendingUp,
  Code,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type PreviewView = "home" | "create-workspace" | "workspace-detail";

export interface PreviewWorkspace {
  id: number | string;
  name: string;
  icon: LucideIcon;
  documentCount: number;
  bgColor: string;
  iconColor: string;
}

interface PreviewContextType {
  workspaces: PreviewWorkspace[];
  currentView: PreviewView;
  activeWorkspaceId: number | string | null;
  addWorkspace: (
    workspace: Omit<PreviewWorkspace, "id" | "documentCount">
  ) => void;
  setView: (view: PreviewView) => void;
  selectWorkspace: (id: number | string) => void;
  activeWorkspace: PreviewWorkspace | null;
}

const defaultWorkspaces: PreviewWorkspace[] = [
  {
    id: 1,
    name: "Product Design",
    icon: Briefcase,
    documentCount: 24,
    bgColor: "#000000",
    iconColor: "#ffffff",
  },
  {
    id: 2,
    name: "Marketing Strategy",
    icon: TrendingUp,
    documentCount: 15,
    bgColor: "#ffffff",
    iconColor: "#000000",
  },
  {
    id: 3,
    name: "Engineering Docs",
    icon: Code,
    documentCount: 42,
    bgColor: "#000000",
    iconColor: "#ffffff",
  },
  {
    id: 4,
    name: "Personal Notes",
    icon: BookOpen,
    documentCount: 31,
    bgColor: "#ffffff",
    iconColor: "#000000",
  },
];

const PreviewContext = createContext<PreviewContextType | undefined>(undefined);

export const PreviewProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [workspaces, setWorkspaces] =
    useState<PreviewWorkspace[]>(defaultWorkspaces);
  const [currentView, setCurrentView] = useState<PreviewView>("home");
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<
    number | string | null
  >(null);

  const addWorkspace = (
    workspace: Omit<PreviewWorkspace, "id" | "documentCount">
  ) => {
    const newId = Date.now().toString();
    const newWorkspace: PreviewWorkspace = {
      ...workspace,
      id: newId,
      documentCount: 0,
    };
    setWorkspaces((prev) => [...prev, newWorkspace]);
    setActiveWorkspaceId(newId);
    setCurrentView("workspace-detail");
  };

  const setView = (view: PreviewView) => {
    setCurrentView(view);
    if (view === "home") {
      setActiveWorkspaceId(null);
    }
  };

  const selectWorkspace = (id: number | string) => {
    setActiveWorkspaceId(id);
    setCurrentView("workspace-detail");
  };

  const activeWorkspace =
    workspaces.find((ws) => ws.id === activeWorkspaceId) || null;

  return (
    <PreviewContext.Provider
      value={{
        workspaces,
        currentView,
        activeWorkspaceId,
        addWorkspace,
        setView,
        selectWorkspace,
        activeWorkspace,
      }}
    >
      {children}
    </PreviewContext.Provider>
  );
};

export const usePreview = () => {
  const context = useContext(PreviewContext);
  if (context === undefined) {
    throw new Error("usePreview must be used within a PreviewProvider");
  }
  return context;
};
