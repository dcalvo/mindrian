import { createFileRoute } from "@tanstack/react-router";
import { WorkspacesListView } from "../features/dashboard/WorkspacesListView";

export const Route = createFileRoute("/_auth/workspaces")({
  component: WorkspacesListView,
});
