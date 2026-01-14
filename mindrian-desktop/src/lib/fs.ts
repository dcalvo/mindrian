export interface FileEntry {
  name: string;
  isDirectory: boolean;
  isFile: boolean;
}

export interface FileStats {
  size: number;
  mtime: Date;
  birthtime: Date;
}

export interface FileSystemAPI {
  getMindrianDir: () => Promise<string>;
  readDir: (path: string) => Promise<FileEntry[]>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  createDir: (path: string) => Promise<void>;
  delete: (path: string) => Promise<void>;
  rename: (oldPath: string, newPath: string) => Promise<void>;
  copyFile: (src: string, dest: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
  getStats: (path: string) => Promise<FileStats>;
  reveal: (path: string) => Promise<void>;
  openPath: (path: string) => Promise<string>;
}

// Add to window object
declare global {
  interface Window {
    fs: FileSystemAPI;
  }
}

// Helper to access fs safely
export const fs = window.fs;
