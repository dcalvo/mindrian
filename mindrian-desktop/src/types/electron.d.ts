/// <reference types="vite/client" />
/// <reference types="vite-plugin-electron/electron-env" />

declare interface Window {
  ipcRenderer: import("electron").IpcRenderer;
  fs: {
    getMindrianDir: () => Promise<string>;
    readDir: (
      path: string
    ) => Promise<{ name: string; isDirectory: boolean; isFile: boolean }[]>;
    readFile: (path: string) => Promise<string>;
    writeFile: (path: string, content: string) => Promise<void>;
    createDir: (path: string) => Promise<void>;
    delete: (path: string) => Promise<void>;
    rename: (oldPath: string, newPath: string) => Promise<void>;
    copyFile: (src: string, dest: string) => Promise<void>;
    exists: (path: string) => Promise<boolean>;
    getStats: (
      path: string
    ) => Promise<{ size: number; mtime: Date; birthtime: Date }>;
    reveal: (path: string) => Promise<void>;
    openPath: (path: string) => Promise<void>;
  };
  ai?: {
    setKey: (key: string) => Promise<void>;
    chat: (message: string, workspacePath: string) => Promise<string>;
    onStream: (cb: (chunk: string) => void) => void;
  };
}
