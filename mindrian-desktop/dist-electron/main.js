import { ipcMain, shell, app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
const __dirname$1 = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "vite.svg"),
    webPreferences: {
      preload: path.join(__dirname$1, "preload.mjs")
    },
    width: 1200,
    height: 800
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
ipcMain.handle("fs:get-mindrian-dir", () => {
  return path.join(os.homedir(), "Documents", "Mindrian");
});
ipcMain.handle("fs:read-dir", async (_, dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile()
    }));
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
});
ipcMain.handle("fs:read-file", async (_, filePath) => {
  return fs.readFile(filePath, "utf-8");
});
ipcMain.handle(
  "fs:write-file",
  async (_, filePath, content) => {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    return fs.writeFile(filePath, content, "utf-8");
  }
);
ipcMain.handle("fs:create-dir", async (_, dirPath) => {
  return fs.mkdir(dirPath, { recursive: true });
});
ipcMain.handle("fs:delete", async (_, targetPath) => {
  return fs.rm(targetPath, { recursive: true, force: true });
});
ipcMain.handle("fs:rename", async (_, oldPath, newPath) => {
  return fs.rename(oldPath, newPath);
});
ipcMain.handle("fs:copy-file", async (_, srcPath, destPath) => {
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  return fs.copyFile(srcPath, destPath);
});
ipcMain.handle("fs:exists", async (_, targetPath) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
});
ipcMain.handle("fs:get-stats", async (_, targetPath) => {
  try {
    const stats = await fs.stat(targetPath);
    return {
      size: stats.size,
      mtime: stats.mtime,
      birthtime: stats.birthtime
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    throw error;
  }
});
ipcMain.handle("fs:reveal", async (_, targetPath) => {
  shell.showItemInFolder(targetPath);
});
ipcMain.handle("fs:open-path", async (_, targetPath) => {
  return shell.openPath(targetPath);
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
