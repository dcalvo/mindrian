import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuth } from "../../hooks/auth/useAuth";
import { Toaster } from "sonner";
import { LandingPage } from "../../features/landing/LandingPage";

export function RootLayout() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
      <Toaster />
    </>
  );
}
