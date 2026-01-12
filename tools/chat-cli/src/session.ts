// Interactive REPL session for chat testing

import * as readline from "readline";
import type { ChatChannel } from "./chat-channel.js";
import type { ChatEvent, Conversation, ConversationStatus } from "./types.js";
import { logInfo, logError, logSessionEnd } from "./output.js";

export interface SessionState {
  conversation: Conversation;
  status: ConversationStatus;
  pendingToolId: string | null;
  messagesSent: number;
  eventsReceived: number;
}

export async function runInteractiveSession(
  chatChannel: ChatChannel
): Promise<void> {
  const state: SessionState = {
    conversation: await chatChannel.join(),
    status: "idle",
    pendingToolId: null,
    messagesSent: 0,
    eventsReceived: 0,
  };

  // Subscribe to events
  chatChannel.onEvent((event: ChatEvent) => {
    state.eventsReceived++;
    handleEvent(event, state);
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr, // Use stderr for prompts so stdout is clean NDJSON
    terminal: process.stdin.isTTY ?? false,
  });

  if (process.stdin.isTTY) {
    printHelp();
    rl.setPrompt(getPrompt(state));
    rl.prompt();
  }

  rl.on("line", async (line) => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (process.stdin.isTTY) {
        rl.setPrompt(getPrompt(state));
        rl.prompt();
      }
      return;
    }

    try {
      await handleCommand(trimmed, chatChannel, state);
    } catch (error) {
      logError("Command failed", { error: String(error) });
    }

    if (process.stdin.isTTY) {
      rl.setPrompt(getPrompt(state));
      rl.prompt();
    }
  });

  rl.on("close", () => {
    logSessionEnd({
      messagesSent: state.messagesSent,
      eventsReceived: state.eventsReceived,
      finalStatus: state.status,
    });
    chatChannel.leave();
  });

  // Handle SIGINT gracefully
  process.on("SIGINT", () => {
    rl.close();
  });
}

function handleEvent(event: ChatEvent, state: SessionState): void {
  switch (event.type) {
    case "status_changed":
      state.status = event.status;
      break;
    case "tool_call_requested":
      state.pendingToolId = event.id;
      if (process.stdin.isTTY) {
        process.stderr.write(
          `\n[Tool call requested: ${event.name}] Use /approve or /reject\n`
        );
      }
      break;
    case "tool_call_approved":
    case "tool_call_rejected":
    case "tool_call_completed":
    case "tool_call_failed":
    case "tool_call_cancelled":
      if (state.pendingToolId === event.id) {
        state.pendingToolId = null;
      }
      break;
  }
}

async function handleCommand(
  input: string,
  channel: ChatChannel,
  state: SessionState
): Promise<void> {
  // Check for commands
  if (input.startsWith("/")) {
    const [cmd, ...args] = input.slice(1).split(/\s+/);

    switch (cmd.toLowerCase()) {
      case "send":
      case "s": {
        const message = args.join(" ");
        if (!message) {
          logError("Usage: /send <message>");
          return;
        }
        const id = crypto.randomUUID();
        await channel.sendMessage(id, message);
        state.messagesSent++;
        break;
      }

      case "approve":
      case "a": {
        const toolId = args[0] || state.pendingToolId;
        if (!toolId) {
          logError("No tool call to approve. Usage: /approve [tool_id]");
          return;
        }
        await channel.approveToolCall(toolId);
        break;
      }

      case "reject":
      case "r": {
        const toolId = args[0] || state.pendingToolId;
        if (!toolId) {
          logError("No tool call to reject. Usage: /reject [tool_id] [reason]");
          return;
        }
        const reason = args.slice(1).join(" ") || "Rejected by user";
        await channel.rejectToolCall(toolId, reason);
        break;
      }

      case "cancel":
      case "c": {
        await channel.cancel();
        break;
      }

      case "status": {
        logInfo("Current status", {
          status: state.status,
          pendingToolId: state.pendingToolId,
          messageCount: state.conversation.messages.length,
        });
        break;
      }

      case "help":
      case "h": {
        printHelp();
        break;
      }

      case "quit":
      case "q": {
        process.exit(0);
        break;
      }

      default:
        logError(`Unknown command: /${cmd}. Type /help for available commands.`);
    }
  } else {
    // Treat as a message to send
    const id = crypto.randomUUID();
    await channel.sendMessage(id, input);
    state.messagesSent++;
  }
}

function getPrompt(state: SessionState): string {
  const statusChar =
    state.status === "idle"
      ? ">"
      : state.status === "running"
        ? "~"
        : "?";
  return `[${state.status}]${statusChar} `;
}

function printHelp(): void {
  process.stderr.write(`
Commands:
  /send <msg>  or just type message  - Send a message
  /approve [id]                      - Approve pending tool call
  /reject [id] [reason]              - Reject pending tool call
  /cancel                            - Cancel current run
  /status                            - Show current status
  /help                              - Show this help
  /quit                              - Exit session

Shortcuts: /s, /a, /r, /c, /h, /q

`);
}
