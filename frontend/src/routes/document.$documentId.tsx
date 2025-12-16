import { createFileRoute } from "@tanstack/react-router";
import { DocumentRoute } from "../pages/DocumentPage";

export const Route = createFileRoute("/document/$documentId")({
  component: DocumentRoute,
});
