/* eslint-disable react-refresh/only-export-components */
import { useRef, type ReactNode } from "react";
import * as Y from "yjs";
import { PhoenixChannelProvider } from "y-phoenix-channel";
import { getSocket } from "../lib/socket";
import { createContext, useContext } from "react";

export interface CollaborationInstance {
  ydoc: Y.Doc;
  provider: PhoenixChannelProvider;
  fragment: Y.XmlFragment;
}

export interface CollaborationContextValue {
  getInstance: (docId: string) => CollaborationInstance;
}

export const CollaborationContext =
  createContext<CollaborationContextValue | null>(null);

export function useCollaborationContext() {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error(
      "useCollaborationContext must be used within a CollaborationProvider"
    );
  }
  return context;
}

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const instancesRef = useRef(new Map<string, CollaborationInstance>());

  const getInstance = (docId: string): CollaborationInstance => {
    let instance = instancesRef.current.get(docId);
    if (!instance) {
      const socket = getSocket();
      const ydoc = new Y.Doc();
      const provider = new PhoenixChannelProvider(
        socket,
        `y_doc:${docId}`,
        ydoc
      );
      const fragment = ydoc.getXmlFragment("document-store");
      instance = { ydoc, provider, fragment };
      instancesRef.current.set(docId, instance);
    }
    return instance;
  };

  return (
    <CollaborationContext.Provider value={{ getInstance }}>
      {children}
    </CollaborationContext.Provider>
  );
}
