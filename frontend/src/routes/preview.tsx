import { createFileRoute } from "@tanstack/react-router";
import { PreviewLanding } from "../pages/PreviewPage";

export const Route = createFileRoute("/preview")({
  component: PreviewLanding,
});
