import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";

export type PreviewView =
  | "home"
  | "create-workspace"
  | "workspace-detail"
  | "workspaces-list"
  | "extensions-list";

export interface NavigationState {
  view: PreviewView;
  workspaceId?: number | string | null;
  documentId?: string | null;
}

interface PreviewNavigationContextType {
  current: NavigationState;
  history: NavigationState[];
  push: (view: PreviewView, params?: Partial<NavigationState>) => void;
  pop: () => void;
  canPop: boolean;
  reset: () => void;
}

const PreviewNavigationContext = createContext<
  PreviewNavigationContextType | undefined
>(undefined);

export const PreviewNavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<NavigationState[]>([{ view: "home" }]);

  const current = history[history.length - 1];

  const push = useCallback(
    (view: PreviewView, params?: Partial<NavigationState>) => {
      setHistory((prev) => [...prev, { view, ...params }]);
    },
    []
  );

  const pop = useCallback(() => {
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }, []);

  const reset = useCallback(() => {
    setHistory([{ view: "home" }]);
  }, []);

  const canPop = history.length > 1;

  return (
    <PreviewNavigationContext.Provider
      value={{
        current,
        history,
        push,
        pop,
        canPop,
        reset,
      }}
    >
      {children}
    </PreviewNavigationContext.Provider>
  );
};

export const usePreviewNavigationContext = () => {
  const context = useContext(PreviewNavigationContext);
  if (context === undefined) {
    throw new Error(
      "usePreviewNavigationContext must be used within a PreviewNavigationProvider"
    );
  }
  return context;
};
