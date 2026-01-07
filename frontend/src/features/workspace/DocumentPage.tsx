import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CollaborativeEditor } from "./CollaborativeEditor";
import { getDocument } from "../../lib/api";

const routeApi = getRouteApi("/document/$documentId");

export function DocumentRoute() {
  const { documentId } = routeApi.useParams();
  return <DocumentPage documentId={documentId} />;
}

interface DocumentPageProps {
  documentId: string;
}

function DocumentPage({ documentId }: DocumentPageProps) {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "found" | "not-found">(
    "loading"
  );

  useEffect(() => {
    let cancelled = false;

    getDocument(documentId)
      .then(() => {
        if (!cancelled) setStatus("found");
      })
      .catch(() => {
        if (!cancelled) setStatus("not-found");
      });

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  if (status === "loading") {
    return (
      <div className="document-loading">
        <p>Loading document...</p>
      </div>
    );
  }

  if (status === "not-found") {
    return (
      <div className="document-not-found">
        <h2>Document not found</h2>
        <p>This document may have been deleted or you don't have access.</p>
        <button onClick={() => navigate({ to: "/" })}>Go home</button>
      </div>
    );
  }

  return <CollaborativeEditor key={documentId} docId={documentId} />;
}
