import { createFileRoute } from "@tanstack/react-router";
import { PreviewLanding } from "../features/landing/PreviewPage";

export const Route = createFileRoute("/preview")({
  component: PreviewLanding,
});
