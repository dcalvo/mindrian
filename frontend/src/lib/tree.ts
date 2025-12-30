import type { Folder, Document, FileSystemItem } from "../lib/api";

export interface TreeNode {
  id: string;
  name: string;
  type: "folder" | "document";
  children?: TreeNode[];
  data: FileSystemItem;
}

interface BuildTreeInput {
  folders: Folder[];
  documents: Document[];
}

/**
 * Builds a tree structure from flat folders and documents.
 * Folders can contain other folders (via parent_folder_id) and documents (via folder_id).
 */
export function buildTree({ folders, documents }: BuildTreeInput): TreeNode[] {
  const folderMap = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create folder nodes first
  for (const folder of folders) {
    folderMap.set(folder.id, {
      id: folder.id,
      name: folder.title,
      type: "folder",
      children: [],
      data: folder,
    });
  }

  // Build folder hierarchy
  for (const folder of folders) {
    const node = folderMap.get(folder.id)!;
    if (folder.parent_folder_id && folderMap.has(folder.parent_folder_id)) {
      const parent = folderMap.get(folder.parent_folder_id)!;
      parent.children!.push(node);
    } else {
      roots.push(node);
    }
  }

  // Create document nodes and attach to folders
  for (const doc of documents) {
    const docNode: TreeNode = {
      id: doc.id,
      name: doc.title,
      type: "document",
      children: undefined,
      data: doc,
    };

    if (doc.folder_id && folderMap.has(doc.folder_id)) {
      const parent = folderMap.get(doc.folder_id)!;
      parent.children!.push(docNode);
    } else {
      roots.push(docNode);
    }
  }

  // Sort by position
  const sortByPosition = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => {
        const posA =
          a.data.type === "folder"
            ? (a.data as Folder).position
            : (a.data as Document).position;
        const posB =
          b.data.type === "folder"
            ? (b.data as Folder).position
            : (b.data as Document).position;
        return posA - posB;
      })
      .map((node) => ({
        ...node,
        children: node.children ? sortByPosition(node.children) : undefined,
      }));
  };

  return sortByPosition(roots);
}
