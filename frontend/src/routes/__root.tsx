import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { CollaborationProvider } from "../contexts/CollaborationContext";

export const Route = createRootRoute({
  component: () => (
    <CollaborationProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </CollaborationProvider>
  ),
});
