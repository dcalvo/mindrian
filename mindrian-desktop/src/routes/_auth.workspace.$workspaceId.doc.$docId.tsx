import { useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useEditorContext } from "../contexts/EditorContext";
import { LocalEditor } from "../features/workspace/LocalEditor";

export const Route = createFileRoute(
  "/_auth/workspace/$workspaceId/doc/$docId"
)({
  component: DocumentRoute,
});

function DocumentRoute() {
  const { docId } = Route.useParams();
  const { openDocument, setActiveDocument } = useEditorContext();

  const path = decodeURIComponent(docId);

  // Extract title from path (filename without extension)
  const title = useMemo(() => {
    const filename = path.split("/").pop() || "Untitled";
    return filename.replace(/\.json$/, "");
  }, [path]);

  // Sync URL param to EditorContext - add doc to open tabs if not there
  useEffect(() => {
    openDocument({ id: path, title, path }, false);
    setActiveDocument(path);
  }, [path, title, openDocument, setActiveDocument]);

  return <LocalEditor path={path} key={path} />;
}
