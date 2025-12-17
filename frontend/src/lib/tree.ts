import type { Document } from "../lib/api";

export interface TreeNode {
  id: string;
  name: string;
  isFolder: boolean;
  children?: TreeNode[];
  data: Document;
}

// Helper to convert flat documents to tree structure
export function buildTree(documents: Document[]): TreeNode[] {
  const map = new Map<string, TreeNode>();
  const roots: TreeNode[] = [];

  // Create nodes
  for (const doc of documents) {
    map.set(doc.id, {
      id: doc.id,
      name: doc.title,
      isFolder: doc.is_folder,
      children: doc.is_folder ? [] : undefined,
      data: doc,
    });
  }

  // Build hierarchy
  for (const doc of documents) {
    const node = map.get(doc.id)!;
    if (doc.parent_id && map.has(doc.parent_id)) {
      const parent = map.get(doc.parent_id)!;
      if (parent.children) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  }

  // Sort by position
  const sortByPosition = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .sort((a, b) => a.data.position - b.data.position)
      .map((node) => ({
        ...node,
        children: node.children ? sortByPosition(node.children) : undefined,
      }));
  };

  return sortByPosition(roots);
}
