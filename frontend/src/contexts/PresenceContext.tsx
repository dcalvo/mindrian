/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef, type ReactNode } from "react";
import type { Channel } from "phoenix";
import { Presence } from "phoenix";
import { getSocket } from "../lib/socket";
import { useAuth } from "../hooks/auth/useAuth";
import { createContext, useContext } from "react";

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

export function usePresenceContext() {
  const context = useContext(PresenceContext);
  if (!context) {
    throw new Error(
      "usePresenceContext must be used within a PresenceProvider"
    );
  }
  return context;
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const channelRef = useRef<Channel | null>(null);
  const presenceRef = useRef<Presence | null>(null);

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    const setup = async () => {
      try {
        const socket = getSocket();
        const channel = socket.channel("presence:lobby", {});

        const presence = new Presence(channel);

        presence.onSync(() => {
          if (cancelled) return;

          const presenceList: PresenceUser[] = [];
          presence.list((_id, { metas }) => {
            const meta = metas[0];
            if (meta) {
              presenceList.push({
                id: meta.id,
                email: meta.email,
              });
            }
          });
          setUsers(presenceList);
          setLoading(false);
        });

        await new Promise<void>((resolve, reject) => {
          channel
            .join()
            .receive("ok", () => resolve())
            .receive("error", (err) => reject(new Error(JSON.stringify(err))))
            .receive("timeout", () =>
              reject(new Error("Channel join timeout"))
            );
        });

        if (cancelled) {
          channel.leave();
          return;
        }

        channelRef.current = channel;
        presenceRef.current = presence;
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to connect to presence"
          );
          setLoading(false);
        }
      }
    };

    setup();

    return () => {
      cancelled = true;
      if (channelRef.current) {
        channelRef.current.leave();
        channelRef.current = null;
      }
    };
  }, [user]);

  return (
    <PresenceContext.Provider value={{ users, loading, error }}>
      {children}
    </PresenceContext.Provider>
  );
}
