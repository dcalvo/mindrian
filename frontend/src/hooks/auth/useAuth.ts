import { useState, useEffect, useCallback } from "react";
import { getMe } from "../../lib/api";
import type { User } from "../../lib/api";
import { setSocketToken, disconnectSocket } from "../../lib/socket";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getMe()
      .then((user) => {
        if (!cancelled) {
          setSocketToken(user.socket_token);
          setState({ user, loading: false, error: null });
        }
      })
      .catch(() => {
        if (!cancelled) {
          disconnectSocket();
          setState({ user: null, loading: false, error: "Not authenticated" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const logout = useCallback(() => {
    window.location.href = "/users/log-out";
  }, []);

  const login = useCallback(() => {
    // In dev mode, redirect to Phoenix directly and pass return URL
    const base = import.meta.env.DEV ? "http://localhost:4000" : "";
    const returnTo = import.meta.env.DEV
      ? `?return_to=${encodeURIComponent(window.location.origin + "/")}`
      : "";
    window.location.href = `${base}/users/log-in${returnTo}`;
  }, []);

  return {
    ...state,
    logout,
    login,
    isAuthenticated: !!state.user,
  };
}
