import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { PresenceProvider } from "../contexts/PresenceContext";
import { ChatProvider } from "../contexts/ChatContext";
import { Layout } from "./Layout";
import { useAuth } from "../hooks/useAuth";
import { useAgentDebug } from "../hooks/useAgentDebug";

export function RootLayout() {
  const { user, loading, isAuthenticated, login } = useAuth();

  // Subscribe to agent debug events (dev only, no-op in prod)
  // Must be after auth check since it requires socket token
  useAgentDebug(isAuthenticated);

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <h1>Welcome to Mindrian</h1>
        <p>Please log in to continue.</p>
        <button onClick={login}>Log In</button>
      </div>
    );
  }

  return (
    <PresenceProvider>
      <DocumentsProvider>
        <ChatProvider>
          <CollaborationProvider>
            <Layout user={user!}>
              <Outlet />
            </Layout>
            <TanStackRouterDevtools />
          </CollaborationProvider>
        </ChatProvider>
      </DocumentsProvider>
    </PresenceProvider>
  );
}
