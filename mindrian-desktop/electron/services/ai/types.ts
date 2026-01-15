// Intent classification types
export type IntentType =
  | "quick_edit" // Simple formatting, typos
  | "summarize_short" // Summarize small docs locally
  | "search" // Workspace search (RAG)
  | "summarize_long" // Large docs → Gemini
  | "analyze" // Deep analysis with context
  | "create" // Content generation
  | "multimodal" // PDFs, images
  | "complex_reasoning"; // Planning, strategy

export interface RoutingDecision {
  intent: IntentType;
  confidence: number;
  target: "local" | "gemini-flash" | "gemini-pro";
  useRAG: boolean;
  reasoning?: string;
}

// Service interfaces
export interface EmbeddingResult {
  embedding: number[];
  dimension: number;
}

export interface SearchResult {
  path: string;
  content: string;
  similarity: number;
  metadata?: Record<string, unknown>;
}

export interface LocalLLMOptions {
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
}

export interface ModelConfig {
  modelsPath: string;
}

export interface AgentState {
  mode: "chat" | "larry" | "innovation";
  status:
    | "clarifying"
    | "researching"
    | "analyzing"
    | "synthesizing"
    | "complete"
    | "idle";
  history: Record<string, unknown>[]; // Conversation history
  context: Record<string, unknown>; // Arbitrary context for specific agents (e.g. innovation phase)
}

export interface ThinkingState {
  thought: string; // "Reading file X..."
  action?: string; // "read_file"
  confidence?: number;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  tools: string[]; // Allowed tool names
  initialMessage?: string;
}
