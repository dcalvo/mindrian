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

  public async chat(
    message: string,
    workspacePath: string,
    onStream?: (chunk: string) => void
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
      let result = await chatSession.sendMessageStream(message);
      let fullResponse = "";

      // Loop for handling multi-turn tool use (simplified manual recursion for now)
      // Note: A true robust loop would handle multiple back-and-forths.
      // Here we handle at least one round of tool use.

      const toolCalls: FunctionCall[] = [];

      for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
          fullResponse += text;
          if (onStream) onStream(text);
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
            const response = await this.executeTool(call, workspacePath);
            if (onStream)
              onStream(
                `\n\n*Tool (${call.name}):* \`${JSON.stringify(call.args)}\`\n\n`
              );
            return {
              functionResponse: {
                name: call.name,
                response: { result: response },
              },
            };
          })
        );

        // Send tool outputs back to model and get final response
        result = await chatSession.sendMessageStream(functionResponses);

        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) {
            fullResponse += text;
            if (onStream) onStream(text);
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

        // Handle PDF files
        if (args.path.toLowerCase().endsWith(".pdf")) {
          try {
            const dataBuffer = await fs.readFile(args.path);
            const data = await pdf(dataBuffer);
            return `[PDF Content for ${path.basename(args.path)}]\n${data.text}`;
          } catch (error: any) {
            return `Error reading PDF: ${error.message}`;
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
