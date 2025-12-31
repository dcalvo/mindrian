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
  FileText,
  type LucideIcon,
} from "lucide-react";

export type PreviewView =
  | "home"
  | "create-workspace"
  | "workspace-detail"
  | "workspaces-list"
  | "extensions-list";

export interface PreviewExtension {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  icon: LucideIcon;
  author: string;
  downloads: string;
  rating: number;
  color: string;
  isInstalled?: boolean;
}

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
  extensions: PreviewExtension[];
  currentView: PreviewView;
  activeWorkspaceId: number | string | null;
  addWorkspace: (
    workspace: Omit<PreviewWorkspace, "id" | "documentCount" | "lastUpdated">
  ) => void;
  setView: (view: PreviewView) => void;
  selectWorkspace: (id: number | string) => void;
  activeWorkspace: PreviewWorkspace | null;
}

const defaultExtensions: PreviewExtension[] = [
  {
    id: "bank-of-ideas",
    name: "Bank of Ideas",
    author: "Mindrian Team",
    description: "Bank ideas from workspaces into visual charts.",
    fullDescription:
      "A powerful visualization tool that allows you to 'bank' thoughts, ideas, and snippets from any workspace session directly into a dynamic, interactive visual chart. Perfect for brainstorming, mind mapping, and keeping track of creative sparks across multiple projects.",
    icon: TrendingUp,
    downloads: "12k",
    rating: 4.8,
    color: "#8b5cf6",
    isInstalled: true,
  },
  {
    id: "code-sync",
    name: "Code Sync",
    author: "DevTools Inc",
    description: "Real-time synchronization for engineering docs.",
    fullDescription:
      "Automatically sync your engineering documentation with your codebase. Supports GitHub, GitLab, and Bitbucket integration to ensure your docs are always up to date with your latest commits.",
    icon: Code,
    downloads: "5.4k",
    rating: 4.5,
    color: "#3b82f6",
  },
  {
    id: "markdown-pro",
    name: "Markdown Pro",
    author: "TypeCraft",
    description: "Advanced markdown editor with live preview.",
    fullDescription:
      "Enhance your writing experience with a professional-grade markdown editor. Features side-by-side preview, custom themes, and export to PDF/HTML.",
    icon: FileText,
    downloads: "28k",
    rating: 4.9,
    color: "#10b981",
    isInstalled: true,
  },
  {
    id: "asset-library",
    name: "Asset Library",
    author: "DesignFlow",
    description: "Centralized asset management for designers.",
    fullDescription:
      "Organize your design assets in one place. Drag and drop functionality, auto-tagging, and direct integration with Figma and Adobe Creative Cloud.",
    icon: Briefcase,
    downloads: "8.2k",
    rating: 4.6,
    color: "#f59e0b",
  },
];

const defaultWorkspaces: PreviewWorkspace[] = [
  // ... existing workspaces
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
  const [extensions] = useState<PreviewExtension[]>(defaultExtensions);
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
    if (
      view === "home" ||
      view === "workspaces-list" ||
      view === "extensions-list"
    ) {
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
        extensions,
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
