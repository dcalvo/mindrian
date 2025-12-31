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

export type PreviewView =
  | "home"
  | "create-workspace"
  | "workspace-detail"
  | "workspaces-list";

export interface PreviewWorkspace {
  id: number | string;
  name: string;
  icon: LucideIcon;
  documentCount: number;
  bgColor: string;
  iconColor: string;
  lastUpdated: string;
  collaborators?: { name: string; color: string }[];
}

interface PreviewContextType {
  workspaces: PreviewWorkspace[];
  currentView: PreviewView;
  activeWorkspaceId: number | string | null;
  addWorkspace: (
    workspace: Omit<PreviewWorkspace, "id" | "documentCount" | "lastUpdated">
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
    lastUpdated: "2 mins ago",
    collaborators: [
      { name: "Sagir", color: "#10b981" },
      { name: "Larry", color: "#3b82f6" },
    ],
  },
  {
    id: 2,
    name: "Marketing Strategy",
    icon: TrendingUp,
    documentCount: 15,
    bgColor: "#ffffff",
    iconColor: "#000000",
    lastUpdated: "1 hour ago",
  },
  {
    id: 3,
    name: "Engineering Docs",
    icon: Code,
    documentCount: 42,
    bgColor: "#000000",
    iconColor: "#ffffff",
    lastUpdated: "5 hours ago",
    collaborators: [
      { name: "Calvo", color: "#8b5cf6" },
      { name: "Sagir", color: "#10b981" },
    ],
  },
  {
    id: 4,
    name: "Personal Notes",
    icon: BookOpen,
    documentCount: 31,
    bgColor: "#ffffff",
    iconColor: "#000000",
    lastUpdated: "Yesterday",
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
    workspace: Omit<PreviewWorkspace, "id" | "documentCount" | "lastUpdated">
  ) => {
    const newId = Date.now().toString();
    const newWorkspace: PreviewWorkspace = {
      ...workspace,
      id: newId,
      documentCount: 0,
      lastUpdated: "Just now",
      collaborators: [],
    };
    setWorkspaces((prev) => [newWorkspace, ...prev]);
    setActiveWorkspaceId(newId);
    setCurrentView("workspace-detail");
  };

  const setView = (view: PreviewView) => {
    setCurrentView(view);
    if (view === "home" || view === "workspaces-list") {
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
