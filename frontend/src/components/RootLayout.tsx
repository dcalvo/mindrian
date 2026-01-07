import { Outlet, useLocation } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";
import { DocumentsProvider } from "../contexts/DocumentsContext";
import { PresenceProvider } from "../contexts/PresenceContext";
import { useAuth } from "../hooks/auth/useAuth";
import { Toaster } from "sonner";
import { LandingPage } from "../pages/LandingPage";
import { DashboardPage } from "../pages/DashboardPage";

export function RootLayout() {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Allow specific routes to bypass providers and render standalone
  const isPreviewRoute = location.pathname === "/preview";
  const isLandingRoute = location.pathname === "/landing";

  if (loading && !isPreviewRoute && !isLandingRoute) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  // Preview and Landing routes render without auth wrapper
  if (isPreviewRoute || isLandingRoute) {
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

  // Authenticated users see the new dashboard
  return (
    <PresenceProvider>
      <DocumentsProvider>
        <CollaborationProvider>
          <DashboardPage user={user!} />
          <TanStackRouterDevtools />
          <Toaster />
        </CollaborationProvider>
      </DocumentsProvider>
    </PresenceProvider>
  );
}
