import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="no-document-selected">
      <h2>No document selected</h2>
      <p>Select a document from the sidebar or create a new one.</p>
    </div>
  ),
});
