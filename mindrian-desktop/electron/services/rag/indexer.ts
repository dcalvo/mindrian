import chokidar from "chokidar";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { embeddingService } from "../ai/embedding";
import { VectorStore } from "./vector-store";

// Note: PDFs are NOT indexed for RAG - Gemini handles them natively via vision
const INDEXABLE_EXTENSIONS = [".md", ".txt", ".json"];
const IGNORED_DIRS = [".mindrian", ".git", "node_modules", ".DS_Store"];

export class FileIndexer {
  private watcher: chokidar.FSWatcher | null = null;
  private vectorStore: VectorStore;
  private workspacePath: string;
  private indexingQueue: Set<string> = new Set();
  private isIndexing = false;

  constructor(workspacePath: string, vectorStore: VectorStore) {
    this.workspacePath = workspacePath;
    this.vectorStore = vectorStore;
  }

  async start() {
    console.log("[Indexer] Starting file watcher for:", this.workspacePath);

    // Initial index
    await this.indexWorkspace();

    // Watch for changes
    this.watcher = chokidar.watch(this.workspacePath, {
      ignored: (filePath: string, stats?: any) => {
        const basename = path.basename(filePath);
        return IGNORED_DIRS.includes(basename) || basename.startsWith(".");
      },
      persistent: true,
      ignoreInitial: true,
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100,
      },
    });

    this.watcher
      .on("add", (filePath: string) => this.queueIndexFile(filePath))
      .on("change", (filePath: string) => this.queueIndexFile(filePath))
      .on("unlink", (filePath: string) => this.handleFileDelete(filePath));

    console.log("[Indexer] Watching for file changes");
  }

  private async indexWorkspace() {
    const files = await this.findIndexableFiles(this.workspacePath);
    console.log(`[Indexer] Found ${files.length} files to index`);

    for (const file of files) {
      await this.indexFile(file);
    }

    const count = await this.vectorStore.count();
    console.log(
      `[Indexer] Initial indexing complete. ${count} documents indexed.`
    );
  }

  private async findIndexableFiles(dir: string): Promise<string[]> {
    const files: string[] = [];

    async function scan(currentDir: string) {
      try {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
          if (IGNORED_DIRS.includes(entry.name) || entry.name.startsWith(".")) {
            continue;
          }

          const fullPath = path.join(currentDir, entry.name);

          if (entry.isDirectory()) {
            await scan(fullPath);
          } else if (
            INDEXABLE_EXTENSIONS.some((ext) => entry.name.endsWith(ext))
          ) {
            files.push(fullPath);
          }
        }
      } catch (err) {
        console.error(`[Indexer] Error scanning ${currentDir}:`, err);
      }
    }

    await scan(dir);
    return files;
  }

  private queueIndexFile(filePath: string) {
    if (!INDEXABLE_EXTENSIONS.some((ext) => filePath.endsWith(ext))) {
      return;
    }

    this.indexingQueue.add(filePath);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isIndexing || this.indexingQueue.size === 0) return;

    this.isIndexing = true;

    while (this.indexingQueue.size > 0) {
      const filePath = this.indexingQueue.values().next().value;
      this.indexingQueue.delete(filePath);

      await this.indexFile(filePath);
    }

    this.isIndexing = false;
  }

  private async indexFile(filePath: string) {
    try {
      const content = await this.extractText(filePath);
      if (!content || content.trim().length < 10) {
        console.log(
          `[Indexer] Skipping ${path.basename(filePath)} (too short)`
        );
        return;
      }

      // Truncate very long content for embedding
      const truncatedContent =
        content.length > 8000 ? content.substring(0, 8000) + "..." : content;

      const docId = crypto.createHash("md5").update(filePath).digest("hex");
      const { embedding } = await embeddingService.embed(truncatedContent);

      await this.vectorStore.upsert(
        docId,
        filePath,
        truncatedContent,
        embedding
      );
      console.log(
        `[Indexer] ✓ Indexed: ${filePath ? path.basename(filePath) : "unknown"}`
      );
    } catch (err) {
      console.error(`[Indexer] Failed to index ${filePath}:`, err);
    }
  }

  private async extractText(filePath: string): Promise<string> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".json") {
      // BlockNote documents
      const content = await fs.readFile(filePath, "utf-8");
      try {
        const blocks = JSON.parse(content);
        if (Array.isArray(blocks)) {
          return blocks
            .map((b) => {
              if (b.content && Array.isArray(b.content)) {
                return b.content.map((c: any) => c.text || "").join("");
              }
              return "";
            })
            .filter(Boolean)
            .join("\n");
        }
      } catch {
        // If parsing fails, return empty (don't index invalid JSON)
        return "";
      }
      return content; // Fallback to raw JSON
    }

    // Plain text files (.md, .txt)
    return await fs.readFile(filePath, "utf-8");
  }

  private async handleFileDelete(filePath: string) {
    try {
      await this.vectorStore.deleteByPath(filePath);
      console.log(
        `[Indexer] Removed: ${filePath ? path.basename(filePath) : "unknown"}`
      );
    } catch (err) {
      console.error(`[Indexer] Failed to remove ${filePath}:`, err);
    }
  }

  stop() {
    if (this.watcher) {
      this.watcher.close();
      console.log("[Indexer] Stopped watching files");
    }
  }
}
