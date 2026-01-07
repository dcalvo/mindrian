import { Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { PresenceProvider } from "../contexts/PresenceContext";
import { Layout } from "./Layout";
import { useAuth } from "../hooks/auth/useAuth";
import { Toaster } from "sonner";
import { LandingPage } from "../pages/LandingPage";

export function RootLayout() {
  const { user, loading, isAuthenticated } = useAuth();
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
    return <LandingPage />;
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
