export interface TreeNode {
  id: string; // full path
  name: string;
  type: "folder" | "document" | "file";
  children?: TreeNode[];
  data: any;
}
