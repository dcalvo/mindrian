import { pipeline, env } from "@xenova/transformers";
import type { EmbeddingResult } from "./types";

// Configure to use local models (bundled or cached)
env.allowLocalModels = true;
env.allowRemoteModels = true; // Allow download on first use
env.useBrowserCache = false; // Use electron's app data

export class EmbeddingService {
  private embedder: unknown = null;
  private readonly modelId = "Xenova/bge-small-en-v1.5";
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(cacheDir?: string) {
    if (this.embedder) return;
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = this._doInitialize(cacheDir);

    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  private async _doInitialize(cacheDir?: string) {
    console.log("[Embedding] Initializing BGE-small...");

    if (cacheDir) {
      env.cacheDir = cacheDir;
    }

    this.embedder = await pipeline("feature-extraction", this.modelId);
    console.log("[Embedding] Ready");
  }

  async embed(text: string): Promise<EmbeddingResult> {
    if (!this.embedder) await this.initialize();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await (this.embedder as any)(text, {
      pooling: "mean",
      normalize: true,
    });

    return {
      embedding: Array.from(result.data),
      dimension: result.dims[1],
    };
  }

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }

  isReady(): boolean {
    return this.embedder !== null;
  }
}

export const embeddingService = new EmbeddingService();
