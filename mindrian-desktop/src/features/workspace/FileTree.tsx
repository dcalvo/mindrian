import { useCallback } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Tree } from "react-arborist";
import type {
  CreateHandler,
  DeleteHandler,
  RenameHandler,
  MoveHandler,
} from "react-arborist";
import { FilePlus, FolderPlus } from "lucide-react";
import { useDocumentsContext } from "../../contexts/LocalDocumentsContext";
import { fs } from "../../lib/fs";
import { FileNode } from "./FileNode";
import { type TreeNode } from "../../lib/tree";
import "./FileTree.css";

interface FileTreeProps {
  width?: number;
}

export function FileTree({ width }: FileTreeProps) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as {
    workspaceId?: string;
    docId?: string;
  };
  const { workspaceId } = params;

  // Current document ID (which is now the absolute path)
  // We need to decode it if it comes from URL
  const currentDocumentId = params.docId
    ? decodeURIComponent(params.docId)
    : undefined;

  const {
    treeData,
    loading,
    error,
    createDocument,
    createFolder,
    renameItem,
    moveItem,
    deleteItem,
    importFiles,
  } = useDocumentsContext();

  // Handle navigation when a document is activated
  const handleActivate = useCallback(
    (node: { data: TreeNode }) => {
      if (node.data.type === "document") {
        const path = node.data.id;
        // Navigate using encoded path
        if (workspaceId) {
          navigate({
            to: "/workspace/$workspaceId/doc/$docId",
            params: { workspaceId, docId: encodeURIComponent(path) },
          });
        }
      } else if (node.data.type === "file") {
        // If it's a PDF, open in internal viewer
        if (node.data.name.toLowerCase().endsWith(".pdf")) {
          if (workspaceId) {
            navigate({
              to: "/workspace/$workspaceId/file/$fileId",
              params: { workspaceId, fileId: encodeURIComponent(node.data.id) },
            });
          }
        } else {
          // Handle generic files (system default)
          fs.openPath(node.data.id);
        }
      }
    },
    [navigate, workspaceId]
  );

  // Handle creating new items
  const handleCreate: CreateHandler<TreeNode> = useCallback(
    async ({ parentId, type }) => {
      try {
        if (type === "leaf") {
          const path = await createDocument("Untitled", parentId);
          if (workspaceId) {
            navigate({
              to: "/workspace/$workspaceId/doc/$docId",
              params: { workspaceId, docId: encodeURIComponent(path) },
            });
          }
          return null; // Tree auto-refreshes via context
        } else {
          await createFolder("New Folder", parentId);
          return null;
        }
      } catch (err) {
        console.error("Failed to create:", err);
        return null;
      }
    },
    [createDocument, createFolder, navigate, workspaceId]
  );

  // Handle renaming
  const handleRename: RenameHandler<TreeNode> = useCallback(
    async ({ id, name }) => {
      try {
        await renameItem(id, name);
      } catch (err) {
        console.error("Failed to rename:", err);
      }
    },
    [renameItem]
  );

  // Handle moving (drag-drop)
  const handleMove: MoveHandler<TreeNode> = useCallback(
    async ({ dragIds, parentId, index }) => {
      try {
        await moveItem(dragIds, parentId, index);
      } catch (err) {
        console.error("Failed to move:", err);
      }
    },
    [moveItem]
  );

  // Handle deletion
  const handleDelete: DeleteHandler<TreeNode> = useCallback(
    async ({ ids }) => {
      try {
        if (currentDocumentId && ids.includes(currentDocumentId)) {
          if (workspaceId) {
            navigate({
              to: "/workspace/$workspaceId",
              params: { workspaceId },
            });
          }
        }

        for (const id of ids) {
          await deleteItem(id);
        }
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    [deleteItem, currentDocumentId, navigate, workspaceId]
  );

  // Create new document at root
  const handleCreateDocument = useCallback(async () => {
    try {
      const path = await createDocument("Untitled", null);
      if (workspaceId) {
        navigate({
          to: "/workspace/$workspaceId/doc/$docId",
          params: { workspaceId, docId: encodeURIComponent(path) },
        });
      }
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  }, [createDocument, navigate, workspaceId]);

  // Create new folder at root
  const handleCreateFolder = useCallback(async () => {
    try {
      await createFolder("New Folder", null);
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  }, [createFolder]);

  if (loading && treeData.length === 0) {
    return (
      <aside
        className="file-tree"
        style={{ width: width ? `${width}px` : undefined }}
      >
        <div className="file-tree-header">
          <h3>Workspace</h3>
        </div>
        <div className="file-tree-loading">Loading...</div>
      </aside>
    );
  }

  if (error) {
    return (
      <aside
        className="file-tree"
        style={{ width: width ? `${width}px` : undefined }}
      >
        <div className="file-tree-header">
          <h3>Workspace</h3>
        </div>
        <div className="file-tree-error">{error}</div>
      </aside>
    );
  }

  return (
    <aside
      className="file-tree"
      style={{ width: width ? `${width}px` : undefined }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }}
      onDrop={async (e) => {
        e.preventDefault();
        // Check for external files
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          const paths: string[] = [];
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            // Electron adds 'path' to the File object
            const file = e.dataTransfer.files[i] as File & { path?: string };
            if (file.path) {
              paths.push(file.path);
            }
          }
          if (paths.length > 0) {
            await importFiles(paths, null); // Import to root for now
          }
        }
      }}
    >
      <div
        className="file-tree-header"
        style={{ padding: "0 12px 8px", justifyContent: "flex-end" }}
      >
        <div className="file-tree-actions">
          <button
            className="file-tree-action-btn"
            onClick={handleCreateDocument}
            title="New page"
          >
            <FilePlus size={16} />
          </button>
          <button
            className="file-tree-action-btn"
            onClick={handleCreateFolder}
            title="New folder"
          >
            <FolderPlus size={16} />
          </button>
        </div>
      </div>
      <div className="file-tree-content">
        {treeData.length === 0 ? (
          <div className="file-tree-empty">No pages yet</div>
        ) : (
          <Tree<TreeNode>
            data={treeData}
            width="100%"
            height={600}
            indent={20}
            rowHeight={40}
            openByDefault={true}
            selection={currentDocumentId}
            onCreate={handleCreate}
            onRename={handleRename}
            onMove={handleMove}
            onDelete={handleDelete}
            onActivate={handleActivate}
            disableDrop={({ parentNode }) => {
              // Prevent dropping into files
              if (parentNode.data.type !== "folder") return true;
              // Prevent dropping parent into child (handled by arborist usually but good to check)
              return false;
            }}
          >
            {(props) => (
              <FileNode
                {...props}
                onNavigate={() => {}}
                onDelete={(ids: string[]) => {
                  handleDelete({ ids, nodes: [] });
                }}
                onCreateFile={async (parentId: string) => {
                  try {
                    const path = await createDocument("Untitled", parentId);
                    if (workspaceId) {
                      navigate({
                        to: "/workspace/$workspaceId/doc/$docId",
                        params: {
                          workspaceId,
                          docId: encodeURIComponent(path),
                        },
                      });
                    }
                  } catch (e) {
                    console.error(e);
                  }
                }}
              />
            )}
          </Tree>
        )}
      </div>
    </aside>
  );
}
