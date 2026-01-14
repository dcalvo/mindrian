/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CollaborativeEditor } from "../features/workspace/CollaborativeEditor";
import { useEditorContext } from "../contexts/EditorContext";
import { useDocumentsContext } from "../contexts/DocumentsContext";

export const Route = createFileRoute(
  "/_auth/workspace/$workspaceId/doc/$docId"
)({
  component: DocumentRoute,
});

function DocumentRoute() {
  const { docId } = Route.useParams();
  const { openDocument, setActiveDocument } = useEditorContext();
  const { documents } = useDocumentsContext();

  // Sync URL param to EditorContext - add doc to open tabs if not there
  useEffect(() => {
    const doc = documents.find((d) => d.id === docId);
    if (doc) {
      // openDocument adds to tabs without navigating since we're already here
      openDocument(doc, false);
      setActiveDocument(docId);
    }
  }, [docId, documents, openDocument, setActiveDocument]);

  return <CollaborativeEditor key={docId} docId={docId} />;
}
