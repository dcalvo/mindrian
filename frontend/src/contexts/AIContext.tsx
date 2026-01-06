"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AIContextType {
  context: string[];
  addToContext: (contextItem: string) => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

interface AIProviderProps {
  children: ReactNode;
}

export function AIProvider({ children }: AIProviderProps) {
  const [context, setContext] = useState<string[]>(["some initial context!"]);

  const addToContext = (contextItem: string) => {
    setContext((prev) => [...prev, contextItem]);
  };

  return (
    <AIContext.Provider value={{ context, addToContext }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAIContext() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAIContext must be used within an AIProvider");
  }
  return context;
}