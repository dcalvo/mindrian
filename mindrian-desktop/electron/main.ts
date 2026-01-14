import { app, BrowserWindow, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");

export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
    width: 1200,
    height: 800,
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// ============================================================================
// File System IPC Handlers
// ============================================================================

ipcMain.handle("fs:get-mindrian-dir", () => {
  return path.join(os.homedir(), "Documents", "Mindrian");
});

ipcMain.handle("fs:read-dir", async (_, dirPath: string) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries.map((entry) => ({
      name: entry.name,
      isDirectory: entry.isDirectory(),
      isFile: entry.isFile(),
    }));
  } catch (error) {
    console.error("Error reading directory:", error);
    throw error;
  }
});

ipcMain.handle("fs:read-file", async (_, filePath: string) => {
  return fs.readFile(filePath, "utf-8");
});

ipcMain.handle(
  "fs:write-file",
  async (_, filePath: string, content: string) => {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    return fs.writeFile(filePath, content, "utf-8");
  }
);

ipcMain.handle("fs:create-dir", async (_, dirPath: string) => {
  return fs.mkdir(dirPath, { recursive: true });
});

ipcMain.handle("fs:delete", async (_, targetPath: string) => {
  return fs.rm(targetPath, { recursive: true, force: true });
});

ipcMain.handle("fs:rename", async (_, oldPath: string, newPath: string) => {
  return fs.rename(oldPath, newPath);
});

ipcMain.handle("fs:copy-file", async (_, srcPath: string, destPath: string) => {
  // Ensure destination folder exists
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  return fs.copyFile(srcPath, destPath);
});

ipcMain.handle("fs:exists", async (_, targetPath: string) => {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
});

ipcMain.handle("fs:get-stats", async (_, targetPath: string) => {
  try {
    const stats = await fs.stat(targetPath);
    return {
      size: stats.size,
      mtime: stats.mtime,
      birthtime: stats.birthtime,
    };
  } catch (error) {
    console.error("Error getting stats:", error);
    throw error;
  }
});

// Reveal in Finder/Explorer
ipcMain.handle("fs:reveal", async (_, targetPath: string) => {
  shell.showItemInFolder(targetPath);
});

// Open file (system default)
ipcMain.handle("fs:open-path", async (_, targetPath: string) => {
  return shell.openPath(targetPath);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
