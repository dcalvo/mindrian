import { createFileRoute } from "@tanstack/react-router";
import { DocumentRoute } from "../features/workspace/DocumentPage";

export const Route = createFileRoute("/document/$documentId")({
  component: DocumentRoute,
});
