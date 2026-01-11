import { createFileRoute } from "@tanstack/react-router";
import { PreviewHomeView } from "../features/landing/PreviewHomeView";

export const Route = createFileRoute("/_auth/")({
  component: PreviewHomeView,
});
