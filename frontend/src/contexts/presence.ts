import { createContext } from "react";

export interface PresenceUser {
  id: string;
  email: string;
}

export interface PresenceContextValue {
  users: PresenceUser[];
  loading: boolean;
  error: string | null;
}

export const PresenceContext = createContext<PresenceContextValue | null>(null);
