import { ipcRenderer, contextBridge } from "electron";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args: Parameters<typeof ipcRenderer.on>) {
    const [channel, listener] = args;
    return ipcRenderer.on(channel, (event, ...args) =>
      listener(event, ...args)
    );
  },
  off(...args: Parameters<typeof ipcRenderer.off>) {
    const [channel, ...omit] = args;
    return ipcRenderer.off(channel, ...omit);
  },
  send(...args: Parameters<typeof ipcRenderer.send>) {
    const [channel, ...omit] = args;
    return ipcRenderer.send(channel, ...omit);
  },
  invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
    const [channel, ...omit] = args;
    return ipcRenderer.invoke(channel, ...omit);
  },
});

// Type-safe FS API wrapper
contextBridge.exposeInMainWorld("fs", {
  getMindrianDir: () => ipcRenderer.invoke("fs:get-mindrian-dir"),
  readDir: (path: string) => ipcRenderer.invoke("fs:read-dir", path),
  readFile: (path: string) => ipcRenderer.invoke("fs:read-file", path),
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke("fs:write-file", path, content),
  createDir: (path: string) => ipcRenderer.invoke("fs:create-dir", path),
  delete: (path: string) => ipcRenderer.invoke("fs:delete", path),
  rename: (oldPath: string, newPath: string) =>
    ipcRenderer.invoke("fs:rename", oldPath, newPath),
  copyFile: (src: string, dest: string) =>
    ipcRenderer.invoke("fs:copy-file", src, dest),
  exists: (path: string) => ipcRenderer.invoke("fs:exists", path),
  getStats: (path: string) => ipcRenderer.invoke("fs:get-stats", path),
  reveal: (path: string) => ipcRenderer.invoke("fs:reveal", path),
  openPath: (path: string) => ipcRenderer.invoke("fs:open-path", path),
});

// AI API Wrapper
contextBridge.exposeInMainWorld("ai", {
  setKey: (key: string) => ipcRenderer.invoke("ai:set-key", key),
  checkKey: () => ipcRenderer.invoke("ai:check-key"),
  chat: (message: string, workspacePath: string) =>
    ipcRenderer.invoke("ai:chat", { message, workspacePath }),
  onStream: (callback: (chunk: any) => void) => {
    // Remove old listeners to prevent duplicates (simple approach)
    ipcRenderer.removeAllListeners("ai:stream-chunk");
    ipcRenderer.on("ai:stream-chunk", (_, chunk) => callback(chunk));
  },
});
