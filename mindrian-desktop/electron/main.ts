import { app, BrowserWindow, ipcMain, shell, safeStorage } from "electron";
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

// ============================================================================
// Constants & Paths
// ============================================================================
const MINDRIAN_ROOT = path.join(os.homedir(), "Documents", "Mindrian");
const CONFIG_PATH = path.join(MINDRIAN_ROOT, ".mindrian", "config.json");

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

function ensureSafePath(targetPath: string) {
  const resolvedPath = path.resolve(targetPath);
  const resolvedRoot = path.resolve(MINDRIAN_ROOT);

  // Check if path is within root (or is the root itself)
  if (
    resolvedPath !== resolvedRoot &&
    !resolvedPath.startsWith(resolvedRoot + path.sep)
  ) {
    console.warn(
      `[Security] Accessing path outside Mindrian root: ${targetPath}`
    );
    // Relaxed security for external workspaces (User requested)
    // throw new Error(
    //   `Security Error: Cannot access files outside the Mindrian directory.`
    // );
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
    console.log(`[Main] Writing file: ${filePath}`);
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
// AI Agent Handlers & Persisted Settings
// ============================================================================
import { aiService } from "./services/ai";
import { aiOrchestrator } from "./services/ai/orchestrator";

interface MindrianConfig {
  api_key?: string;
  api_key_unencrypted?: string;
}

async function saveApiKey(key: string) {
  try {
    await fs.mkdir(path.dirname(CONFIG_PATH), { recursive: true });
    let config: MindrianConfig = {};
    try {
      const content = await fs.readFile(CONFIG_PATH, "utf-8");
      config = JSON.parse(content);
    } catch {
      // Config doesn't exist yet
    }

    if (safeStorage.isEncryptionAvailable()) {
      const encrypted = safeStorage.encryptString(key);
      config.api_key = encrypted.toString("base64");
    } else {
      // Fallback (not recommended for secrets but better than failing)
      config.api_key_unencrypted = key;
    }

    await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save API key:", err);
  }
}

async function loadSettings() {
  try {
    const content = await fs.readFile(CONFIG_PATH, "utf-8");
    const config: MindrianConfig = JSON.parse(content);

    let key = "";
    if (config.api_key && safeStorage.isEncryptionAvailable()) {
      const buffer = Buffer.from(config.api_key, "base64");
      key = safeStorage.decryptString(buffer);
    } else if (config.api_key_unencrypted) {
      key = config.api_key_unencrypted;
    }

    if (key) {
      aiService.setApiKey(key);
    }
  } catch {
    // No config or failed to load
  }
}

ipcMain.handle("ai:set-key", async (_, key: string) => {
  aiService.setApiKey(key);
  await saveApiKey(key);
});

ipcMain.handle("ai:check-key", () => {
  return aiService.hasKey();
});

ipcMain.handle("ai:chat", async (event, { message, workspacePath }) => {
  ensureSafePath(workspacePath);
  try {
    // Use the orchestrator for smart routing
    const reply = await aiOrchestrator.chat(
      message,
      workspacePath,
      (chunk: unknown) => {
        // Check if the sender is still valid before trying to send
        if (!event.sender.isDestroyed()) {
          event.sender.send("ai:stream-chunk", chunk);
        }
      }
    );
    return reply;
  } catch (err: unknown) {
    throw new Error((err as Error).message);
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

app.whenReady().then(async () => {
  await loadSettings();
  createWindow();
});
