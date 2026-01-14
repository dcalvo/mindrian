import { embeddingService } from "../ai/embedding";
import type { VectorStore } from "./vector-store";
import type { SearchResult } from "../ai/types";
import path from "path";

export class Retriever {
  constructor(private vectorStore: VectorStore) {}

  async search(query: string, topK: number = 3): Promise<SearchResult[]> {
    const { embedding } = await embeddingService.embed(query);
    return this.vectorStore.search(embedding, topK);
  }

  /**
   * Format search results into context string for LLM
   */
  formatContext(results: SearchResult[], workspacePath: string): string {
    if (results.length === 0) return "";

    const contextParts = results.map((r, i) => {
      // Make path relative to workspace for readability
      const relativePath = path.relative(workspacePath, r.path);
      const preview = r.content.substring(0, 600);
      const truncated = r.content.length > 600 ? "..." : "";

      return `### Document ${i + 1}: ${relativePath}
Relevance: ${(r.similarity * 100).toFixed(1)}%

${preview}${truncated}`;
    });

    return `## Relevant workspace documents:

${contextParts.join("\n\n---\n\n")}

Use the above documents to help answer the user's question.`;
  }
}
