import { createFileRoute } from "@tanstack/react-router";
import { CreateWorkspaceView } from "../features/dashboard/CreateWorkspaceView";

export const Route = createFileRoute("/_auth/workspaces/new")({
  component: CreateWorkspaceView,
});
