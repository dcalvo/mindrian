import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PDFView } from "../features/workspace/PDFView";
import { useEditorContext } from "../contexts/EditorContext";

export const Route = createFileRoute(
  "/_auth/workspace/$workspaceId/file/$fileId"
)({
  component: FileRoute,
});

function FileRoute() {
  const { fileId } = Route.useParams();
  const { openDocument, setActiveDocument } = useEditorContext();

  const path = decodeURIComponent(fileId);
  const title = path.split("/").pop() || "Untitled";

  // Sync with EditorContext to show in tabs
  useEffect(() => {
    // Pass false to avoid redirecting back to /doc/...
    openDocument({ id: path, title, path }, false);
    setActiveDocument(path);
  }, [path, title, openDocument, setActiveDocument]);

  return <PDFView url={path} />;
}
