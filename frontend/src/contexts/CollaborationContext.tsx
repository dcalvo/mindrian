import { useRef, type ReactNode } from "react";
import * as Y from "yjs";
import { PhoenixChannelProvider } from "y-phoenix-channel";
import { getSocket } from "../lib/socket";
import {
  CollaborationContext,
  type CollaborationInstance,
} from "./collaboration";

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
