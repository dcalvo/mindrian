import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";

export type DashboardView =
  | "home"
  | "create-workspace"
  | "workspace-detail"
  | "workspaces-list"
  | "extensions-list";

export interface NavigationState {
  view: DashboardView;
  workspaceId?: number | string | null;
  documentId?: string | null;
}

interface DashboardNavigationContextType {
  current: NavigationState;
  history: NavigationState[];
  push: (view: DashboardView, params?: Partial<NavigationState>) => void;
  pop: () => void;
  canPop: boolean;
  reset: () => void;
}

const DashboardNavigationContext = createContext<
  DashboardNavigationContextType | undefined
>(undefined);

export const DashboardNavigationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [history, setHistory] = useState<NavigationState[]>([{ view: "home" }]);

  const current = history[history.length - 1];

  const push = useCallback(
    (view: DashboardView, params?: Partial<NavigationState>) => {
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
    <DashboardNavigationContext.Provider
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
    </DashboardNavigationContext.Provider>
  );
};

export const useDashboardNavigationContext = () => {
  const context = useContext(DashboardNavigationContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardNavigationContext must be used within a DashboardNavigationProvider"
    );
  }
  return context;
};
