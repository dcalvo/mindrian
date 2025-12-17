import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { PresenceProvider } from "../contexts/PresenceContext";
import { Layout } from "./Layout";
import { useAuth } from "../hooks/useAuth";

export function RootLayout() {
  const { user, loading, isAuthenticated, login } = useAuth();

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
        <CollaborationProvider>
          <Layout user={user!}>
            <Outlet />
          </Layout>
          <TanStackRouterDevtools />
        </CollaborationProvider>
      </DocumentsProvider>
    </PresenceProvider>
  );
}
