import { useMemo, useCallback } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Tree } from "react-arborist";
import type {
  CreateHandler,
  DeleteHandler,
  RenameHandler,
  MoveHandler,
} from "react-arborist";
import { FilePlus, FolderPlus } from "lucide-react";
import { useDocumentsContext } from "../../contexts/DocumentsContext";
import { FileNode } from "./FileNode";
import { buildTree, type TreeNode } from "../../lib/tree";
import "./FileTree.css";

interface FileTreeProps {
  width?: number;
}

export function FileTree({ width }: FileTreeProps) {
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { documentId?: string };
  const currentDocumentId = params.documentId;
  const {
    folders,
    documents,
    loading,
    error,
    addDocument,
    addFolder,
    renameItem,
    moveItem,
    removeItem,
  } = useDocumentsContext();

  // Transform folders + documents to tree structure
  const treeData = useMemo(
    () => buildTree({ folders, documents }),
    [folders, documents]
  );

  // Handle navigation when a document is activated
  const handleActivate = useCallback(
    (node: { data: TreeNode }) => {
      if (node.data.type !== "folder") {
        navigate({
          to: "/document/$documentId",
          params: { documentId: node.data.id },
        });
      }
    },
    [navigate]
  );

  // Handle creating new items
  const handleCreate: CreateHandler<TreeNode> = useCallback(
    async ({ parentId, type }) => {
      try {
        if (type === "leaf") {
          const doc = await addDocument("Untitled", parentId);
          navigate({
            to: "/document/$documentId",
            params: { documentId: doc.id },
          });
          return {
            id: doc.id,
            name: doc.title,
            type: "document" as const,
            data: doc,
          };
        } else {
          const folder = await addFolder("New Folder", parentId);
          return {
            id: folder.id,
            name: folder.title,
            type: "folder" as const,
            children: [],
            data: folder,
          };
        }
      } catch (err) {
        console.error("Failed to create:", err);
        return null;
      }
    },
    [addDocument, addFolder, navigate]
  );

  // Handle renaming
  const handleRename: RenameHandler<TreeNode> = useCallback(
    async ({ id, name, node }) => {
      // Prevent renaming to existing name in same folder (same type only)
      const parent = node.parent;
      if (parent && parent.children) {
        const isFolder = node.data.type === "folder";
        const hasDuplicate = parent.children.some(
          (sibling) =>
            sibling.id !== id &&
            sibling.data.type === node.data.type &&
            sibling.data.name.toLowerCase() === name.trim().toLowerCase()
        );

        if (hasDuplicate) {
          alert(
            `A ${isFolder ? "folder" : "page"} with the name "${name}" already exists in this location.`
          );
          return;
        }
      }

      try {
        await renameItem(id, name, node.data.type === "folder");
      } catch (err) {
        console.error("Failed to rename:", err);
      }
    },
    [renameItem]
  );

  // Handle moving (drag-drop)
  const handleMove: MoveHandler<TreeNode> = useCallback(
    async ({ dragIds, parentId, index, dragNodes }) => {
      try {
        await Promise.all(
          dragIds.map((id, i) => {
            const node = dragNodes[i];
            const isFolder = node.data.type === "folder";
            return moveItem(id, parentId, index + i, isFolder);
          })
        );
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
        // Check if currently open document is being deleted (directly or via parent)
        if (currentDocumentId) {
          // Build ancestry for current document
          const currentDoc = documents.find((d) => d.id === currentDocumentId);
          if (currentDoc) {
            const ancestry = new Set<string>([currentDocumentId]);

            // Add folder ancestry
            let folderId = currentDoc.folder_id;
            while (folderId) {
              ancestry.add(folderId);
              const folder = folders.find((f) => f.id === folderId);
              folderId = folder?.parent_folder_id ?? null;
            }

            if (ids.some((id) => ancestry.has(id))) {
              navigate({ to: "/" });
            }
          }
        }

        for (const id of ids) {
          await removeItem(id);
        }
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    },
    [removeItem, currentDocumentId, documents, folders, navigate]
  );

  // Create new document at root
  const handleCreateDocument = useCallback(async () => {
    try {
      const doc = await addDocument("Untitled", null);
      navigate({
        to: "/document/$documentId",
        params: { documentId: doc.id },
      });
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  }, [addDocument, navigate]);

  // Create new folder at root
  const handleCreateFolder = useCallback(async () => {
    try {
      await addFolder("New Folder", null);
    } catch (err) {
      console.error("Failed to create folder:", err);
    }
  }, [addFolder]);

  if (loading) {
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
    >
      <div className="file-tree-header">
        <h3>Workspace</h3>
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
            indent={16}
            rowHeight={32}
            openByDefault={true}
            selection={currentDocumentId}
            onCreate={handleCreate}
            onRename={handleRename}
            onMove={handleMove}
            onDelete={handleDelete}
            onActivate={handleActivate}
            disableDrop={({ parentNode, dragNodes }) => {
              return dragNodes.some(
                (node) => node.parent?.id === parentNode.id
              );
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
                    const doc = await addDocument("Untitled", parentId);
                    navigate({
                      to: "/document/$documentId",
                      params: { documentId: doc.id },
                    });
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
