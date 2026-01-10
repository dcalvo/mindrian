// Chat channel operations

import type { Channel, Socket } from "phoenix";
import type { ChatEvent, Conversation } from "./types.js";
import {
  logChannelEvent,
  logJoined,
  logJoinError,
  logPushReply,
  logPushSent,
  logInfo,
} from "./output.js";

export interface ChatChannel {
  channel: Channel;
  conversationId: string;
  workspaceId: string;
  join(): Promise<Conversation>;
  sendMessage(id: string, content: string): Promise<void>;
  approveToolCall(toolId: string): Promise<void>;
  rejectToolCall(toolId: string, reason?: string): Promise<void>;
  cancel(): Promise<void>;
  onEvent(callback: (event: ChatEvent) => void): void;
  leave(): void;
}

let pushRefCounter = 0;

function nextRef(): string {
  return String(++pushRefCounter);
}

export function createChatChannel(
  socket: Socket,
  conversationId: string,
  workspaceId: string
): ChatChannel {
  const topic = `chat:${conversationId}`;
  const channel = socket.channel(topic, { workspace_id: workspaceId });

  return {
    channel,
    conversationId,
    workspaceId,

    join(): Promise<Conversation> {
      return new Promise((resolve, reject) => {
        logInfo("Joining channel", { topic, workspaceId });

        // Subscribe to events for logging (single subscription)
        channel.on("event", (payload: unknown) => {
          logChannelEvent(payload as Record<string, unknown>);
        });

        channel
          .join()
          .receive("ok", (reply: unknown) => {
            logJoined(topic, reply);
            resolve(reply as Conversation);
          })
          .receive("error", (error) => {
            logJoinError(topic, error);
            reject(new Error(`Failed to join channel: ${JSON.stringify(error)}`));
          })
          .receive("timeout", () => {
            logJoinError(topic, "timeout");
            reject(new Error("Channel join timeout"));
          });
      });
    },

    sendMessage(id: string, content: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const ref = nextRef();
        const payload = { id, content };
        logPushSent(ref, "send_message", payload);

        channel
          .push("send_message", payload)
          .receive("ok", (reply) => {
            logPushReply(ref, "ok", reply);
            resolve();
          })
          .receive("error", (error) => {
            logPushReply(ref, "error", error);
            reject(new Error(`Send message failed: ${JSON.stringify(error)}`));
          })
          .receive("timeout", () => {
            logPushReply(ref, "timeout");
            reject(new Error("Send message timeout"));
          });
      });
    },

    approveToolCall(toolId: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const ref = nextRef();
        const payload = { tool_id: toolId };
        logPushSent(ref, "approve_tool_call", payload);

        channel
          .push("approve_tool_call", payload)
          .receive("ok", (reply) => {
            logPushReply(ref, "ok", reply);
            resolve();
          })
          .receive("error", (error) => {
            logPushReply(ref, "error", error);
            reject(new Error(`Approve tool call failed: ${JSON.stringify(error)}`));
          })
          .receive("timeout", () => {
            logPushReply(ref, "timeout");
            reject(new Error("Approve tool call timeout"));
          });
      });
    },

    rejectToolCall(toolId: string, reason?: string): Promise<void> {
      return new Promise((resolve, reject) => {
        const ref = nextRef();
        const payload = { tool_id: toolId, reason: reason || "" };
        logPushSent(ref, "reject_tool_call", payload);

        channel
          .push("reject_tool_call", payload)
          .receive("ok", (reply) => {
            logPushReply(ref, "ok", reply);
            resolve();
          })
          .receive("error", (error) => {
            logPushReply(ref, "error", error);
            reject(new Error(`Reject tool call failed: ${JSON.stringify(error)}`));
          })
          .receive("timeout", () => {
            logPushReply(ref, "timeout");
            reject(new Error("Reject tool call timeout"));
          });
      });
    },

    cancel(): Promise<void> {
      return new Promise((resolve, reject) => {
        const ref = nextRef();
        logPushSent(ref, "cancel", {});

        channel
          .push("cancel", {})
          .receive("ok", (reply) => {
            logPushReply(ref, "ok", reply);
            resolve();
          })
          .receive("error", (error) => {
            logPushReply(ref, "error", error);
            reject(new Error(`Cancel failed: ${JSON.stringify(error)}`));
          })
          .receive("timeout", () => {
            logPushReply(ref, "timeout");
            reject(new Error("Cancel timeout"));
          });
      });
    },

    onEvent(callback: (event: ChatEvent) => void): void {
      channel.on("event", (payload: unknown) => {
        const event = payload as ChatEvent;
        callback(event);
      });
    },

    leave(): void {
      logInfo("Leaving channel", { topic });
      channel.leave();
    },
  };
}
