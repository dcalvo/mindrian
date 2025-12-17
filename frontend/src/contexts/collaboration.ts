import { createContext } from "react";
import * as Y from "yjs";
import { PhoenixChannelProvider } from "y-phoenix-channel";

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
