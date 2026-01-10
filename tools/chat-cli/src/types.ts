// Event types matching backend Mindrian.Chat.Event module

export type ConversationStatus = "idle" | "running" | "awaiting_approval";

export type ToolCallStatus =
  | "pending_approval"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "rejected"
  | "cancelled";

export type ChatEvent =
  | { type: "status_changed"; status: ConversationStatus }
  | { type: "agent_started"; message_id: string }
  | { type: "agent_chunk"; message_id: string; chunk: string }
  | { type: "agent_complete"; message_id: string }
  | { type: "agent_cancelled"; message_id: string }
  | {
      type: "tool_call_requested";
      id: string;
      name: string;
      arguments: Record<string, unknown>;
      description: string;
    }
  | { type: "tool_call_approved"; id: string }
  | { type: "tool_call_executing"; id: string }
  | { type: "tool_call_completed"; id: string }
  | { type: "tool_call_failed"; id: string; error: string }
  | { type: "tool_call_rejected"; id: string }
  | { type: "tool_call_cancelled"; id: string }
  | { type: "error"; message: string };

export interface UserMessage {
  id: string;
  role: "user";
  content: string;
  inserted_at?: string;
}

export interface AgentMessage {
  id: string;
  role: "agent";
  content: string;
  status: "streaming" | "complete" | "cancelled";
  inserted_at?: string;
}

export interface ToolCallMessage {
  id: string;
  role: "tool_call";
  name: string;
  arguments: Record<string, unknown>;
  description: string;
  status: ToolCallStatus;
  result?: string;
  error?: string;
  rejection_reason?: string;
  inserted_at?: string;
}

export type Message = UserMessage | AgentMessage | ToolCallMessage;

export interface Conversation {
  id: string;
  status: ConversationStatus;
  messages: Message[];
  pending_error: string | null;
}

// CLI output event types
export interface OutputEvent {
  ts: string;
  event: string;
  [key: string]: unknown;
}
