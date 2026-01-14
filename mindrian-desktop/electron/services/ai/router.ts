import type { RoutingDecision } from "./types";

export class IntentRouter {
  /**
   * Classify user intent and determine routing strategy
   */
  classify(userMessage: string, conversationLength: number): RoutingDecision {
    const msg = userMessage.toLowerCase();

    // Rule-based classification (fast, no model needed)

    // 1. Search/RAG patterns
    if (this.isSearchQuery(msg)) {
      return {
        intent: "search",
        confidence: 0.9,
        target: "local",
        useRAG: true,
        reasoning: "User is searching workspace documents",
      };
    }

    // 2. Quick edits (typos, formatting)
    if (this.isQuickEdit(msg)) {
      return {
        intent: "quick_edit",
        confidence: 0.85,
        target: "local",
        useRAG: false,
        reasoning: "Simple text transformation, local LLM sufficient",
      };
    }

    // 3. Short summarization (if referring to specific small doc)
    if (this.isShortSummarize(msg)) {
      return {
        intent: "summarize_short",
        confidence: 0.75,
        target: "local",
        useRAG: true,
        reasoning: "Short document summarization",
      };
    }

    // 4. Multimodal (images, PDFs with vision)
    if (this.isMultimodal(msg)) {
      return {
        intent: "multimodal",
        confidence: 0.8,
        target: "gemini-flash",
        useRAG: false,
        reasoning: "Requires vision capabilities",
      };
    }

    // 5. Long/complex summarization
    if (this.isLongSummarize(msg)) {
      return {
        intent: "summarize_long",
        confidence: 0.8,
        target: "gemini-flash",
        useRAG: false,
        reasoning: "Large document summarization needs API",
      };
    }

    // 6. Complex reasoning (strategy, planning, analysis)
    if (this.isComplexReasoning(msg)) {
      return {
        intent: "complex_reasoning",
        confidence: 0.75,
        target: "gemini-pro",
        useRAG: true,
        reasoning: "Complex reasoning task requiring Pro model",
      };
    }

    // 7. Creation tasks
    if (this.isCreation(msg)) {
      return {
        intent: "create",
        confidence: 0.7,
        target: "gemini-flash",
        useRAG: conversationLength > 3,
        reasoning: "Content creation task",
      };
    }

    // Default: general analysis with Gemini Flash
    return {
      intent: "analyze",
      confidence: 0.6,
      target: "gemini-flash",
      useRAG: conversationLength > 3,
      reasoning: "General query, using Flash for quality",
    };
  }

  private isSearchQuery(msg: string): boolean {
    const keywords = [
      "find",
      "search",
      "where",
      "did i write",
      "locate",
      "what did i",
      "show me",
      "look for",
      "do i have",
    ];
    return keywords.some((kw) => msg.includes(kw));
  }

  private isQuickEdit(msg: string): boolean {
    const keywords = [
      "fix typo",
      "correct",
      "clean up formatting",
      "fix grammar",
      "remove duplicates",
      "capitalize",
    ];
    return keywords.some((kw) => msg.includes(kw));
  }

  private isShortSummarize(msg: string): boolean {
    const hasKeyword = msg.includes("summarize") || msg.includes("summary");
    const isShort =
      msg.includes("brief") || msg.includes("quick") || msg.includes("short");
    return hasKeyword && isShort;
  }

  private isLongSummarize(msg: string): boolean {
    const hasKeyword = msg.includes("summarize") || msg.includes("summary");
    const isLong =
      msg.includes("entire") || msg.includes("full") || msg.includes("pdf");
    return hasKeyword && (isLong || !this.isShortSummarize(msg));
  }

  private isMultimodal(msg: string): boolean {
    const keywords = [
      "image",
      "picture",
      "photo",
      "screenshot",
      "what does this look like",
      "describe this image",
    ];
    return keywords.some((kw) => msg.includes(kw));
  }

  private isComplexReasoning(msg: string): boolean {
    const keywords = [
      "strategy",
      "plan out",
      "analyze trend",
      "compare and contrast",
      "evaluate options",
      "design a system",
      "think through",
      "how should i approach",
    ];
    return keywords.some((kw) => msg.includes(kw));
  }

  private isCreation(msg: string): boolean {
    const keywords = [
      "write",
      "create",
      "generate",
      "draft",
      "compose",
      "make a",
    ];
    return keywords.some((kw) => msg.includes(kw));
  }
}
