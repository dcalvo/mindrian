import { createContext } from "react";

export type ChatStatus = "idle" | "thinking" | "awaiting_approval" | "executing";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ToolRequest {
  requestId: string;
  toolName: string;
  toolInput: Record<string, unknown>;
  description: string;
}

export interface ToolResult {
  requestId: string;
  success: boolean;
  result?: unknown;
  error?: string;
}

export interface ChatContextValue {
  messages: ChatMessage[];
  pendingTool: ToolRequest | null;
  status: ChatStatus;
  sessionId: string | null;
  error: string | null;
  sendMessage: (content: string) => void;
  approveToolRequest: (requestId: string) => void;
  rejectToolRequest: (requestId: string) => void;
  cancel: () => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);
