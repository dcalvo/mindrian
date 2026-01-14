import { createFileRoute } from "@tanstack/react-router";
import { PDFView } from "../features/workspace/PDFView";

export const Route = createFileRoute(
  "/_auth/workspace/$workspaceId/file/$fileId"
)({
  component: FileRoute,
});

function FileRoute() {
  const { fileId } = Route.useParams();

  const path = decodeURIComponent(fileId);

  return <PDFView url={path} />;
}
