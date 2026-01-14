import {
  GenerativeModel,
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import fs from "node:fs/promises";
import path from "node:path";

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
      history: this.conversationHistory,
    });

    try {
      let result = await chatSession.sendMessageStream(message);
      let fullResponse = "";

      // Loop for handling multi-turn tool use (simplified manual recursion for now)
      // Note: A true robust loop would handle multiple back-and-forths.
      // Here we handle at least one round of tool use.

      let toolCalls: any[] = [];

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

    try {
      if (name === "read_file") {
        if (!this.isSafePath(args.path, workspacePath))
          return "Access Denied: Path outside workspace.";
        return await fs.readFile(args.path, "utf-8");
      }
      if (name === "list_dir") {
        if (!this.isSafePath(args.path, workspacePath))
          return "Access Denied: Path outside workspace.";
        const entries = await fs.readdir(args.path);
        return entries.join("\n");
      }
    } catch (e: any) {
      return `Error: ${e.message}`;
    }
    return "Unknown tool";
  }
}

export const aiService = new AIService();
