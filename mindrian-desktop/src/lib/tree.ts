export interface TreeNode {
  id: string; // full path
  name: string;
  type: "folder" | "document" | "file";
  children?: TreeNode[];
  data: {
    id: string;
    type: "folder" | "document" | "file";
    title: string;
    isAsset?: boolean;
  };
}
