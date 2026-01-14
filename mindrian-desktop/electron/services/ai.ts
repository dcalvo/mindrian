import {
  FunctionCall,
  GenerativeModel,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Define the event types for the stream
export type StreamEvent =
  | { type: "text_delta"; content: string }
  | { type: "tool_call"; toolCall: FunctionCall }
  | { type: "tool_result"; toolCallId: string; result: any };

export class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private apiKey: string | null = null;

  // Track context
  private conversationHistory: any[] = [];

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
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
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
    onStream?: (event: StreamEvent) => void
  ) {
    if (!this.model) {
      this.initModel(); // Try once more with env
      if (!this.model) {
        throw new Error(
          "API Key not set. Please configure your Gemini API key."
        );
      }
    }

    const chatSession = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `WORKSPACE_INFO: You are currently working in the workspace located at: ${workspacePath}. When listing or reading files, use absolute paths starting with this workspace path.`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `Understood. I will work within the workspace at ${workspacePath} and use absolute paths when accessing files and directories.`,
            },
          ],
        },
        ...this.conversationHistory,
      ],
    });

    try {
      let result = await this.retryWithBackoff(() =>
        chatSession.sendMessageStream(message)
      );
      let fullResponse = "";

      // Loop for handling multi-turn tool use (simplified manual recursion for now)
      // Note: A true robust loop would handle multiple back-and-forths.
      // Here we handle at least one round of tool use.

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
            // Notify frontend of the tool call
            if (onStream) {
              onStream({ type: "tool_call", toolCall: call });
            }

            const response = await this.executeTool(call, workspacePath);

            // Notify frontend of the result
            // Note: FunctionCall doesn't have an ID in Gemini's simple API usually,
            // but for UI matching we might need one. For now we use the name as proxy if single.
            // But `call` object might not have a unique ID property exposed easily in this SDK version.
            // We'll rely on order or just send the result correlated by name/context.
            if (onStream) {
              onStream({
                type: "tool_result",
                toolCallId: call.name,
                result: response,
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

      // Sync history manually if needed, but getHistory() is better source of truth
      // this.conversationHistory = await chatSession.getHistory();

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
        if (!this.isSafePath(args.path, workspacePath))
          return "Access Denied: Path outside workspace.";

        // Handle PDF files - Use native multimodal support
        if (args.path.toLowerCase().endsWith(".pdf")) {
          try {
            const dataBuffer = await fs.readFile(args.path);
            const base64Data = dataBuffer.toString("base64");
            // Return a special marker that indicates this should be sent as inline data
            // In a future iteration, we'll modify the chat flow to handle this
            return `[PDF_FILE: ${args.path}]\n[BASE64_DATA: ${base64Data.substring(0, 100)}...]\n\nNote: This PDF should be sent to the model as inline data for native vision analysis. For now, falling back to text extraction.\n\n${(await pdf(dataBuffer)).text}`;
          } catch (error: any) {
            return `Error reading PDF: ${error.message}`;
          }
        }

        // Handle Image files - Use native multimodal support
        const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
        if (
          imageExtensions.some((ext) => args.path.toLowerCase().endsWith(ext))
        ) {
          try {
            const dataBuffer = await fs.readFile(args.path);
            const base64Data = dataBuffer.toString("base64");
            const mimeType = args.path.toLowerCase().endsWith(".png")
              ? "image/png"
              : args.path.toLowerCase().endsWith(".gif")
                ? "image/gif"
                : args.path.toLowerCase().endsWith(".webp")
                  ? "image/webp"
                  : "image/jpeg";
            return `[IMAGE_FILE: ${args.path}]\n[MIME_TYPE: ${mimeType}]\n[BASE64_DATA: ${base64Data.substring(0, 100)}...]\n\nNote: This image should be sent to the model as inline data for native vision analysis.`;
          } catch (error: any) {
            return `Error reading image: ${error.message}`;
          }
        }

        const content = await fs.readFile(args.path, "utf-8");

        // Handle BlockNote JSON files (heuristic: ends with .json)
        if (args.path.toLowerCase().endsWith(".json")) {
          try {
            const parsed = JSON.parse(content);
            // Simple heuristic to check if it's a BlockNote doc (array of blocks)
            if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].type) {
              let markdown = `[BlockNote Document: ${path.basename(args.path)}]\n\n`;
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
        if (!this.isSafePath(args.path, workspacePath))
          return "Access Denied: Path outside workspace.";

        const entries = await fs.readdir(args.path, { withFileTypes: true });

        const filteredEntries = entries.filter(
          (entry) => !IGNORED_FILES.includes(entry.name)
        );

        const formattedEntries = filteredEntries.map((entry) => {
          const type = entry.isDirectory() ? "[DIR]" : "[FILE]";
          return `${type} ${entry.name}`;
        });

        return formattedEntries.join("\n");
      }
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
    return "Unknown tool";
  }
}

export const aiService = new AIService();
