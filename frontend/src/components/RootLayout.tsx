import { Outlet, Link, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { PresenceProvider } from "../contexts/PresenceContext";
import { Layout } from "./Layout";
import { useAuth } from "../hooks/auth/useAuth";
import { Toaster } from "sonner";

export function RootLayout() {
  const { user, loading, isAuthenticated, login } = useAuth();
  const location = useLocation();

  // Allow preview route to bypass authentication
  const isPreviewRoute = location.pathname === "/preview";

  if (loading && !isPreviewRoute) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Preview route renders without auth wrapper
  if (isPreviewRoute) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="login-prompt">
        <h1>Welcome to Mindrian</h1>
        <p>Please log in to continue.</p>
        <button onClick={login}>Log In</button>
        <Link to="/preview" className="preview-link">
          Preview New Design →
        </Link>
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
          <Toaster />
        </CollaborationProvider>
      </DocumentsProvider>
    </PresenceProvider>
  );
}
