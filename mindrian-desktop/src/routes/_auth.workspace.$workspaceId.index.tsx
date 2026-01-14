import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/_auth/workspace/$workspaceId/")({
  component: WorkspaceIndexRoute,
});

function WorkspaceIndexRoute() {
  return (
    <div className="editor-empty-state">
      <div className="empty-icon">
        <FileText size={48} strokeWidth={1} />
      </div>
      <h3>Select a document</h3>
      <p>Pick a document from the sidebar to start working</p>
    </div>
  );
}
