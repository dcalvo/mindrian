import {
  FunctionCall,
  GenerativeModel,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

// Define the event types for the stream
export type StreamEvent =
  | { type: "text_delta"; content: string }
  | { type: "tool_call"; toolCall: FunctionCall }
  | { type: "tool_result"; toolCallId: string; result: any };

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private flashModel: GenerativeModel | null = null;
  private proModel: GenerativeModel | null = null;
  private apiKey: string | null = null;

  constructor() {}

  public hasKey(): boolean {
    return !!(this.apiKey || process.env.GEMINI_API_KEY);
  }

  public setApiKey(key: string) {
    this.apiKey = key;
    this.initModel();
  }

  private initModel() {
    const key = this.apiKey || process.env.GEMINI_API_KEY;
    if (!key) return;

    this.genAI = new GoogleGenerativeAI(key);

    const baseConfig = {
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are Mindrian, a local AI agent integrated into a personal workspace app.
            
            CAPABILITIES:
            1. You have access to the user's local file system within their workspace.
            2. You can read files (text, markdown, code, pdfs) and list directories.
            3. You can create/edit documents (JSON blocknote format) and text files.
            
            BEHAVIOR:
            - When asked about files, ALWAYS check the file system first. Do not hallucinate.
            - If you are unsure of a file path, list the directory first to find it.
            
            FORMATTING:
            - Use Markdown.
            `,
          },
        ],
      },
      tools: [
        {
          functionDeclarations: [
            {
              name: "read_file",
              description: "Reads the content of a file from the workspace.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  path: {
                    type: SchemaType.STRING,
                    description: "Absolute path to the file to read",
                  },
                },
                required: ["path"],
              },
            },
            {
              name: "list_dir",
              description: "Lists the contents of a directory.",
              parameters: {
                type: SchemaType.OBJECT,
                properties: {
                  path: {
                    type: SchemaType.STRING,
                    description: "Absolute path to the directory to list",
                  },
                },
                required: ["path"],
              },
            },
          ],
        },
      ],
    };

    this.flashModel = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      ...baseConfig,
    });

    this.proModel = this.genAI.getGenerativeModel({
      model: "gemini-2.5-pro",
      ...baseConfig,
    });
  }

  // Ensure path is safe (simple check re-used here, ideally shared ref)
  private isSafePath(targetPath: string, rootPath: string): boolean {
    const resolved = path.resolve(targetPath);
    const root = path.resolve(rootPath);
    return resolved.startsWith(root);
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries = 3
  ): Promise<T> {
    let lastError: any;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        // Check if it's a rate limit error (429)
        if (error.status === 429 || error.message?.includes("429")) {
          if (attempt < maxRetries) {
            // Exponential backoff: 2^attempt seconds
            const waitTime = Math.pow(2, attempt) * 1000;
            console.log(
              `[AI] Rate limited. Retrying in ${waitTime / 1000}s... (attempt ${attempt + 1}/${maxRetries})`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }
        // If not a rate limit error, or we've exhausted retries, throw
        throw error;
      }
    }
    throw lastError;
  }

  public async chat(
    message: string,
    workspacePath: string,
    modelType: "gemini-2.5-flash" | "gemini-2.5-pro" = "gemini-2.5-flash",
    conversationHistory: any[] = [],
    ragContext?: string,
    onStream?: (event: StreamEvent) => void,
    systemPrompt?: string
  ) {
    if (!this.flashModel || !this.proModel) {
      this.initModel(); // Try once more with env
      if (!this.flashModel || !this.proModel) {
        throw new Error(
          "API Key not set. Please configure your Gemini API key."
        );
      }
    }

    // If a custom system prompt is provided (e.g. for Larry or Innovation agents),
    // we need to instantiate a new model instance for this session.
    // Otherwise, use the cached model.
    let activeModel =
      modelType === "gemini-2.5-pro" ? this.proModel : this.flashModel;

    if (systemPrompt && this.genAI) {
      activeModel = this.genAI.getGenerativeModel({
        model: modelType,
        systemInstruction: {
          role: "system",
          parts: [{ text: systemPrompt }],
        },
        tools: this.flashModel?.tools, // Re-use tool definitions
      });
    }

    // Build context with workspace info and optional RAG context
    const contextParts: string[] = [
      `WORKSPACE_INFO: You are currently working in the workspace located at: ${workspacePath}. When listing or reading files, use absolute paths starting with this workspace path.`,
    ];

    if (ragContext) {
      contextParts.push(ragContext);
    }

    // For the agent loop, conversationHistory contains the full history including recent user/model turns.
    // We prepend context to the current message (message argument) rather than injecting fake history turns
    // because injecting fake history can confuse the model or be rejected by the API if roles aren't alternating perfectly.

    const chatSession = activeModel!.startChat({
      history: conversationHistory,
    });

    try {
      let result = await this.retryWithBackoff(() =>
        chatSession.sendMessageStream(message)
      );
      let fullResponse = "";

      const toolCalls: FunctionCall[] = [];

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          if (onStream) onStream({ type: "text_delta", content: text });
        }

        const calls = chunk.functionCalls();
        if (calls && calls.length > 0) {
          toolCalls.push(...calls);
        }
      }

      // If we got tool calls, execute them and send results back
      if (toolCalls.length > 0) {
        const functionResponses = await Promise.all(
          toolCalls.map(async (call) => {
            if (onStream) {
              onStream({ type: "tool_call", toolCall: call });
            }

            const response = await this.executeTool(call, workspacePath);

            if (onStream) {
              // Sanitize large binary data for the UI stream to prevent performance issues
              let uiResult = response;
              if (response && typeof response === "object") {
                if (response.type === "pdf_base64") {
                  uiResult = `[PDF Loaded: ${response.path}] (${response.data.length} bytes)`;
                } else if (response.type === "image_base64") {
                  uiResult = `[Image Loaded: ${response.path}]`;
                }
              }

              onStream({
                type: "tool_result",
                toolCallId: call.name,
                result: uiResult,
              });
            }

            return {
              functionResponse: {
                name: call.name,
                response: { result: response },
              },
            };
          })
        );

        // Send tool outputs back to model and get final response
        result = await this.retryWithBackoff(() =>
          chatSession.sendMessageStream(functionResponses)
        );

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullResponse += text;
            if (onStream) onStream({ type: "text_delta", content: text });
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("AI Error:", error);
      throw error;
    }
  }

  private async executeTool(call: any, workspacePath: string) {
    const { name, args } = call;
    console.log(`[AI] Executing ${name} with`, args);

    const IGNORED_FILES = [".DS_Store", ".mindrian", ".git", "node_modules"];

    try {
      if (name === "read_file") {
        let targetPath = args.path;

        // Ensure we have an absolute path if a relative one was provided
        if (!path.isAbsolute(targetPath)) {
          targetPath = path.join(workspacePath, targetPath);
        }

        if (!this.isSafePath(targetPath, workspacePath))
          return "Access Denied: Path outside workspace.";

        const safeArgs = { ...args, path: targetPath };

        // Handle PDF files - Use native multimodal support
        if (safeArgs.path.toLowerCase().endsWith(".pdf")) {
          try {
            const dataBuffer = await fs.readFile(safeArgs.path);
            const base64Data = dataBuffer.toString("base64");
            // Return special marker for internal processing
            return {
              type: "pdf_base64",
              mimeType: "application/pdf",
              data: base64Data,
              path: safeArgs.path,
            };
          } catch (error: any) {
            return `Error reading PDF: ${error.message}`;
          }
        }

        // Handle Image files - Use native multimodal support
        const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        if (
          imageExtensions.some((ext) =>
            safeArgs.path.toLowerCase().endsWith(ext)
          )
        ) {
          try {
            const dataBuffer = await fs.readFile(safeArgs.path);
            const base64Data = dataBuffer.toString("base64");
            const mimeType = safeArgs.path.toLowerCase().endsWith(".png")
              ? "image/png"
              : safeArgs.path.toLowerCase().endsWith(".gif")
                ? "image/gif"
                : safeArgs.path.toLowerCase().endsWith(".webp")
                  ? "image/webp"
                  : "image/jpeg";

            return {
              type: "image_base64",
              mimeType: mimeType,
              data: base64Data,
              path: safeArgs.path,
            };
          } catch (error: any) {
            return `Error reading image: ${error.message}`;
          }
        }

        const content = await fs.readFile(safeArgs.path, "utf-8");

        // Handle BlockNote JSON files (heuristic: ends with .json)
        if (safeArgs.path.toLowerCase().endsWith(".json")) {
          try {
            const parsed = JSON.parse(content);
            // Simple heuristic to check if it's a BlockNote doc (array of blocks)
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
              let markdown = `[BlockNote Document: ${path.basename(safeArgs.path)}]\n\n`;
              for (const block of parsed) {
                if (block.content) {
                  if (Array.isArray(block.content)) {
                    // BlockNote content is an array of styled text objects
                    const text = block.content.map((c: any) => c.text).join("");

                    if (block.type === "heading") {
                      markdown += `# ${text}\n\n`;
                    } else if (block.type === "bulletListItem") {
                      markdown += `- ${text}\n`;
                    } else if (block.type === "numberedListItem") {
                      markdown += `1. ${text}\n`;
                    } else {
                      markdown += `${text}\n\n`;
                    }
                  } else if (typeof block.content === "string") {
                    // Fallback if content is string (older versions?)
                    markdown += `${block.content}\n\n`;
                  }
                }
              }
              return markdown;
            }
          } catch (e) {
            // Not JSON or check failed, treat as text
          }
        }

        return content;
      }
      if (name === "list_dir") {
        let targetPath = args.path;

        // Handle root/workspace aliases
        if (
          !targetPath ||
          targetPath === "." ||
          targetPath === "/" ||
          targetPath.toLowerCase() === "root"
        ) {
          targetPath = workspacePath;
        }

        // Ensure we have an absolute path if a relative one was provided
        if (!path.isAbsolute(targetPath)) {
          targetPath = path.join(workspacePath, targetPath);
        }

        if (!this.isSafePath(targetPath, workspacePath)) {
          console.warn(
            `[AI] Access Denied for path: ${targetPath} (Workspace: ${workspacePath})`
          );
          return `Access Denied: The path '${targetPath}' is outside the current workspace. You can only access files within: ${workspacePath}`;
        }

        const entries = await fs.readdir(targetPath, { withFileTypes: true });

        const filteredEntries = entries.filter(
          (entry) => !IGNORED_FILES.includes(entry.name)
        );

        const formattedEntries = filteredEntries.map((entry) => {
          const type = entry.isDirectory() ? "[DIR]" : "[FILE]";
          return `${type} ${entry.name}`;
        });

        if (formattedEntries.length === 0) return "(Empty Directory)";

        return formattedEntries.join("\n");
      }
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
    return "Unknown tool";
  }
}

export const aiService = new AIService();
