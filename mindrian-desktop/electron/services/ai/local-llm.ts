import {
  getLlama,
  LlamaModel,
  LlamaContext,
  LlamaChatSession,
} from "node-llama-cpp";
import path from "path";
import type { LocalLLMOptions } from "./types";

export class LocalLLMService {
  private llama: unknown = null; // Type difficult to import directly, treating as unknown
  private model: LlamaModel | null = null;
  private context: LlamaContext | null = null;
  private isInitializing = false;
  private initPromise: Promise<void> | null = null;

  async initialize(modelsPath: string) {
    if (this.model && this.context) return;
    if (this.isInitializing && this.initPromise) {
      return this.initPromise;
    }

    this.isInitializing = true;
    this.initPromise = this._doInitialize(modelsPath);

    try {
      await this.initPromise;
    } finally {
      this.isInitializing = false;
      this.initPromise = null;
    }
  }

  private async _doInitialize(modelsPath: string) {
    console.log("[LocalLLM] Loading Qwen2.5-1.5B...");

    const modelPath = path.join(
      modelsPath,
      "qwen2.5-1.5b-instruct-q4_k_m.gguf"
    );

    this.llama = await getLlama();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.model = await (this.llama as any).loadModel({ modelPath });
    this.context = await this.model!.createContext({
      contextSize: 4096, // Small context for speed
    });

    console.log("[LocalLLM] Ready");
  }

  async chat(
    prompt: string,
    systemPrompt: string,
    options: LocalLLMOptions = {},
    onStream?: (text: string) => void
  ): Promise<string> {
    if (!this.context || !this.model) {
      throw new Error("Local LLM not initialized");
    }

    const session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
      systemPrompt,
    });

    let fullResponse = "";

    const response = await session.prompt(prompt, {
      maxTokens: options.maxTokens ?? 512,
      temperature: options.temperature ?? 0.7,
      onTextChunk: (text: string) => {
        fullResponse += text;
        if (onStream) onStream(text);
      },
    });

    return fullResponse || response;
  }

  isReady(): boolean {
    return this.model !== null && this.context !== null;
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
      this.context = null;
    }
    if (this.model) {
      await this.model.dispose();
      this.model = null;
    }
  }
}

export const localLLMService = new LocalLLMService();
