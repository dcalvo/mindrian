import { createFileRoute } from "@tanstack/react-router";
import { ExtensionsView } from "../features/workspace/ExtensionsView";

export const Route = createFileRoute("/_auth/extensions")({
  component: ExtensionsView,
});
