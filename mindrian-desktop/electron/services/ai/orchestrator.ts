import { IntentRouter } from "./router";
import { embeddingService } from "./embedding";
import { aiService, type StreamEvent } from "../ai"; // Gemini service
import { Retriever } from "../rag/retriever";
import { VectorStore } from "../rag/vector-store";
import { FileIndexer } from "../rag/indexer";
import { app } from "electron";
import path from "path";
import { Persona } from "./types";
import { PERSONAS } from "./personas";

interface ConversationMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

export class AIOrchestrator {
  private router = new IntentRouter();
  private retriever: Retriever | null = null;
  private indexer: FileIndexer | null = null;
  private vectorStore: VectorStore | null = null;

  private conversationHistory: ConversationMessage[] = [];
  // private readonly MAX_HISTORY = 20; // Increased history for agent loops

  private currentWorkspacePath: string | null = null;
  private isInitialized = false;

  private activePersona: Persona = PERSONAS.default;
  // private agentState: AgentState = {
  //   mode: "chat",
  //   status: "idle",
  //   history: [],
  //   context: {},
  // };

  async initialize(workspacePath: string) {
    if (this.isInitialized && this.currentWorkspacePath === workspacePath) {
      console.log("[Orchestrator] Already initialized for this workspace");
      return;
    }

    console.log("[Orchestrator] Initializing for workspace:", workspacePath);

    // Clean up previous workspace if switching
    if (this.currentWorkspacePath !== workspacePath) {
      this.cleanup();
      this.conversationHistory = [];
    }

    this.currentWorkspacePath = workspacePath;

    try {
      // Initialize services
      console.log("[Orchestrator] Initializing AI services...");

      await Promise.all([
        embeddingService.initialize(
          path.join(app.getPath("userData"), "transformers-cache")
        ),
      ]);

      // Initialize RAG
      this.vectorStore = new VectorStore(workspacePath);
      this.retriever = new Retriever(this.vectorStore);
      this.indexer = new FileIndexer(workspacePath, this.vectorStore);

      // Start indexing in background
      await this.indexer.start();

      this.isInitialized = true;
      console.log("[Orchestrator] Ready");
    } catch (error) {
      console.error("[Orchestrator] Initialization failed:", error);
      throw error;
    }
  }

  async chat(
    userMessage: string,
    workspacePath: string,
    onStream?: (event: StreamEvent) => void
  ): Promise<string> {
    await this.initialize(workspacePath);

    // 1. Determine Intent & Persona (if not already locked in a multi-turn flow)
    const decision = this.router.classify(
      userMessage,
      this.conversationHistory.length / 2
    );

    // Switch persona based on intent triggers (simplified logic)
    if (userMessage.toLowerCase().includes("help me think")) {
      this.activePersona = PERSONAS.larry;
      console.log("[Orchestrator] Switched to Persona: Larry");
    } else if (userMessage.toLowerCase().includes("trend")) {
      this.activePersona = PERSONAS.trending_to_absurd;
      console.log("[Orchestrator] Switched to Persona: Trending to Absurd");
    } else {
      // Default to standard assistant if no specific trigger
      if (this.activePersona.id !== "default" && decision.intent === "search") {
        // Keep current persona unless explicitly reset, or if just searching allow helper to do it
      }
    }

    console.log("[Orchestrator] Routing decision:", {
      intent: decision.intent,
      persona: this.activePersona.name,
      target: decision.target,
    });

    // 2. Execute Agent Loop
    return this.executeAgentLoop(userMessage, workspacePath, onStream);
  }

  private async executeAgentLoop(
    userMessage: string,
    workspacePath: string,
    onStream?: (event: StreamEvent) => void
  ): Promise<string> {
    const MAX_STEPS = 5;
    let currentStep = 0;
    let accumulatedContext = "";

    // Add user message to history
    this.conversationHistory.push({
      role: "user",
      parts: [{ text: userMessage }],
    });

    // 2a. Initial RAG Search (Context Injection)
    // We always do a lightweight local search first to ground the model
    if (this.retriever) {
      try {
        const results = await this.retriever.search(userMessage, 3);
        if (results.length > 0) {
          accumulatedContext = this.retriever.formatContext(
            results,
            workspacePath
          );
          console.log(
            `[Orchestrator] Found ${results.length} docs for context`
          );
        }
      } catch (e) {
        console.error("RAG Search failed", e);
      }
    }

    let finalResponse = "";

    while (currentStep < MAX_STEPS) {
      currentStep++;
      console.log(`[Orchestrator] Agent Step ${currentStep}/${MAX_STEPS}`);

      // Emit "Thinking" event
      if (onStream) {
        onStream({
          type: "text_delta",
          content: "", // No text yet
        });
        // We'll add a 'thinking' event type to the frontend later
      }

      // Generate next step
      const response = await aiService.chat(
        userMessage, // This is technically redundant in history but required by API
        workspacePath,
        "gemini-2.5-pro", // Always use Pro for reasoning
        this.conversationHistory, // Contains the full conversation so far
        accumulatedContext, // RAG context
        onStream,
        this.activePersona.systemPrompt // Inject persona prompt
      );

      // In the current implementation of aiService.chat, it executes tools internally and returns the final text.
      // To strictly implement the loop *here*, we would need aiService to return the ToolCall without executing it.
      // However, for V1 of this refactor, aiService.chat ALREADY handles the "Call Tool -> Get Result -> Generate Answer" flow for a single turn.
      // To enable *multi-step* reasoning (e.g. List -> Read -> Answer), we rely on Gemini's "Auto-Function Calling" or we iterate here.

      // For this step, we will assume aiService.chat handles the immediate tools.
      // We update our history with the result.
      this.conversationHistory.push({
        role: "model",
        parts: [{ text: response }],
      });

      finalResponse = response;
      break; // Currently breaking after 1 turn until we refactor aiService to return control flow
    }

    return finalResponse;
  }

  cleanup() {
    console.log("[Orchestrator] Cleaning up...");
    this.indexer?.stop();
    this.vectorStore?.close();
    this.retriever = null;
    this.indexer = null;
    this.vectorStore = null;
    this.isInitialized = false;
  }
}

export const aiOrchestrator = new AIOrchestrator();
