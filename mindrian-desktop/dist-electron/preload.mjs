"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(
      channel,
      (event, ...args2) => listener(event, ...args2)
    );
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
});
electron.contextBridge.exposeInMainWorld("fs", {
  getMindrianDir: () => electron.ipcRenderer.invoke("fs:get-mindrian-dir"),
  readDir: (path) => electron.ipcRenderer.invoke("fs:read-dir", path),
  readFile: (path) => electron.ipcRenderer.invoke("fs:read-file", path),
  writeFile: (path, content) => electron.ipcRenderer.invoke("fs:write-file", path, content),
  createDir: (path) => electron.ipcRenderer.invoke("fs:create-dir", path),
  delete: (path) => electron.ipcRenderer.invoke("fs:delete", path),
  rename: (oldPath, newPath) => electron.ipcRenderer.invoke("fs:rename", oldPath, newPath),
  copyFile: (src, dest) => electron.ipcRenderer.invoke("fs:copy-file", src, dest),
  exists: (path) => electron.ipcRenderer.invoke("fs:exists", path),
  getStats: (path) => electron.ipcRenderer.invoke("fs:get-stats", path),
  reveal: (path) => electron.ipcRenderer.invoke("fs:reveal", path),
  openPath: (path) => electron.ipcRenderer.invoke("fs:open-path", path)
});
