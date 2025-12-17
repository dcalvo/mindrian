import { useState } from "react";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useDocuments } from "../hooks/useDocuments";
import type { Document } from "../lib/api";

export function FileTree() {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { documentId?: string };
  const currentDocumentId = params.documentId;
  const {
    documents,
    loading,
    error,
    addDocument,
    renameDocument,
    removeDocument,
  } = useDocuments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCreate = async () => {
    setActionError(null);
    try {
      const doc = await addDocument();
      navigate({ to: "/document/$documentId", params: { documentId: doc.id } });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to create document"
      );
    }
  };

  const handleStartRename = (doc: Document) => {
    setEditingId(doc.id);
    setEditingTitle(doc.title);
    setActionError(null);
  };

  const handleRename = async (id: string) => {
    try {
      if (editingTitle.trim()) {
        await renameDocument(id, editingTitle.trim());
      }
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to rename document"
      );
    } finally {
      setEditingId(null);
      setEditingTitle("");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this document?")) {
      setActionError(null);
      try {
        await removeDocument(id);
        if (currentDocumentId === id) {
          navigate({ to: "/" });
        }
      } catch (err) {
        setActionError(
          err instanceof Error ? err.message : "Failed to delete document"
        );
      }
    }
  };

  if (loading) {
    return (
      <aside className="file-tree">
        <div className="file-tree-header">
          <h3>Pages</h3>
        </div>
        <p className="placeholder">Loading...</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="file-tree">
        <div className="file-tree-header">
          <h3>Pages</h3>
        </div>
        <p className="error">{error}</p>
      </aside>
    );
  }

  return (
    <aside className="file-tree">
      <div className="file-tree-header">
        <h3>Pages</h3>
        <button
          onClick={handleCreate}
          className="create-button"
          title="New page"
        >
          +
        </button>
      </div>
      {actionError && (
        <p className="error" role="alert">
          {actionError}
        </p>
      )}
      {documents.length === 0 ? (
        <p className="placeholder">No pages yet</p>
      ) : (
        <ul className="document-list">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className={doc.id === currentDocumentId ? "active" : ""}
            >
              {editingId === doc.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleRename(doc.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRename(doc.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <Link
                  to="/document/$documentId"
                  params={{ documentId: doc.id }}
                  className="document-link"
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    handleStartRename(doc);
                  }}
                >
                  <span className="document-title">{doc.title}</span>
                  <button
                    className="delete-button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(doc.id);
                    }}
                    title="Delete"
                  >
                    X
                  </button>
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
