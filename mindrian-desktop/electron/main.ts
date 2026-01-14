import { app, BrowserWindow, ipcMain, shell } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import dotenv from "dotenv";

dotenv.config();

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
      webSecurity: false, // Allow loading local files (file://) in dev/prod for the PDF viewer
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

const MINDRIAN_ROOT = path.join(os.homedir(), "Documents", "Mindrian");

function ensureSafePath(targetPath: string) {
  const resolvedPath = path.resolve(targetPath);
  const resolvedRoot = path.resolve(MINDRIAN_ROOT);

  // Check if path is within root (or is the root itself)
  if (
    resolvedPath !== resolvedRoot &&
    !resolvedPath.startsWith(resolvedRoot + path.sep)
  ) {
    console.error(`Blocked access to unsafe path: ${targetPath}`);
    throw new Error(
      `Security Error: Cannot access files outside the Mindrian directory.`
    );
  }
}

ipcMain.handle("fs:get-mindrian-dir", () => {
  return MINDRIAN_ROOT;
});

ipcMain.handle("fs:read-dir", async (_, dirPath: string) => {
  ensureSafePath(dirPath);
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
  ensureSafePath(filePath);
  return fs.readFile(filePath, "utf-8");
});

ipcMain.handle(
  "fs:write-file",
  async (_, filePath: string, content: string) => {
    ensureSafePath(filePath);
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    return fs.writeFile(filePath, content, "utf-8");
  }
);

ipcMain.handle("fs:create-dir", async (_, dirPath: string) => {
  ensureSafePath(dirPath);
  return fs.mkdir(dirPath, { recursive: true });
});

ipcMain.handle("fs:delete", async (_, targetPath: string) => {
  ensureSafePath(targetPath);
  // Extra safety: prevent deleting the root
  if (path.resolve(targetPath) === path.resolve(MINDRIAN_ROOT)) {
    throw new Error(
      "Security Error: Cannot delete the Mindrian root directory."
    );
  }
  return fs.rm(targetPath, { recursive: true, force: true });
});

ipcMain.handle("fs:rename", async (_, oldPath: string, newPath: string) => {
  ensureSafePath(oldPath);
  ensureSafePath(newPath);
  return fs.rename(oldPath, newPath);
});

ipcMain.handle("fs:copy-file", async (_, srcPath: string, destPath: string) => {
  // Source can be anywhere (importing), but Dest must be safe
  ensureSafePath(destPath);
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

// ============================================================================
// AI Agent Handlers
// ============================================================================
import { aiService } from "./services/ai";

ipcMain.handle("ai:set-key", (_, key: string) => {
  aiService.setApiKey(key);
});

ipcMain.handle("ai:check-key", () => {
  return aiService.hasKey();
});

ipcMain.handle("ai:chat", async (event, { message, workspacePath }) => {
  ensureSafePath(workspacePath);
  try {
    // We send chunks back via webContents.send
    const reply = await aiService.chat(message, workspacePath, (chunk) => {
      event.sender.send("ai:stream-chunk", chunk);
    });
    return reply;
  } catch (err: any) {
    throw new Error(err.message);
  }
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
