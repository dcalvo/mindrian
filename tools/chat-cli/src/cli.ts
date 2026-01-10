#!/usr/bin/env node
// Main CLI entry point

import { program } from "commander";
import { login } from "./auth.js";
import { createSocketClient } from "./socket-client.js";
import { createChatChannel } from "./chat-channel.js";
import { runInteractiveSession } from "./session.js";
import { logSessionStart, logError, logInfo, logChannelEvent } from "./output.js";

program
  .name("chat-cli")
  .description("CLI tool for AI-friendly testing of Mindrian chat")
  .version("0.1.0");

program
  .command("session")
  .description("Start an interactive chat session")
  .requiredOption("-e, --email <email>", "User email")
  .requiredOption("-p, --password <password>", "User password")
  .requiredOption("-w, --workspace <id>", "Workspace ID")
  .option("-c, --conversation <id>", "Conversation ID (auto-generated if not provided)")
  .option("-u, --url <url>", "Backend URL", "http://localhost:4000")
  .action(async (options) => {
    const conversationId = options.conversation || crypto.randomUUID();

    logSessionStart({
      command: "session",
      email: options.email,
      workspace: options.workspace,
      conversation: conversationId,
      url: options.url,
    });

    try {
      // Authenticate
      const auth = await login(options.email, options.password, options.url);

      // Connect socket
      const socketUrl = options.url.replace(/^http/, "ws") + "/socket";
      const socketClient = createSocketClient(socketUrl, auth.socketToken);
      await socketClient.connect();

      // Create and join channel
      const chatChannel = createChatChannel(
        socketClient.socket,
        conversationId,
        options.workspace
      );

      // Run interactive session
      await runInteractiveSession(chatChannel);

      // Cleanup
      socketClient.disconnect();
    } catch (error) {
      logError("Session failed", { error: String(error) });
      process.exit(1);
    }
  });

program
  .command("send")
  .description("Send a single message and wait for response")
  .requiredOption("-e, --email <email>", "User email")
  .requiredOption("-p, --password <password>", "User password")
  .requiredOption("-w, --workspace <id>", "Workspace ID")
  .requiredOption("-m, --message <text>", "Message to send")
  .option("-c, --conversation <id>", "Conversation ID (auto-generated if not provided)")
  .option("-u, --url <url>", "Backend URL", "http://localhost:4000")
  .option("--wait-for <status>", "Wait for conversation status (idle, running, awaiting_approval)")
  .option("--timeout <ms>", "Timeout in milliseconds", "60000")
  .action(async (options) => {
    const conversationId = options.conversation || crypto.randomUUID();

    logSessionStart({
      command: "send",
      email: options.email,
      workspace: options.workspace,
      conversation: conversationId,
      message: options.message,
      waitFor: options.waitFor,
      url: options.url,
    });

    try {
      // Authenticate
      const auth = await login(options.email, options.password, options.url);

      // Connect socket
      const socketUrl = options.url.replace(/^http/, "ws") + "/socket";
      const socketClient = createSocketClient(socketUrl, auth.socketToken);
      await socketClient.connect();

      // Create and join channel
      const chatChannel = createChatChannel(
        socketClient.socket,
        conversationId,
        options.workspace
      );

      await chatChannel.join();

      // Track status for waiting
      let currentStatus = "idle";
      chatChannel.onEvent((event) => {
        if (event.type === "status_changed") {
          currentStatus = event.status;
        }
      });

      // Send message
      const messageId = crypto.randomUUID();
      await chatChannel.sendMessage(messageId, options.message);

      // Wait for status if requested
      if (options.waitFor) {
        const timeout = parseInt(options.timeout, 10);
        const waitFor = options.waitFor;

        logInfo("Waiting for status", { waitFor, timeout });

        await new Promise<void>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(new Error(`Timeout waiting for status: ${waitFor}`));
          }, timeout);

          const checkStatus = () => {
            if (currentStatus === waitFor) {
              clearTimeout(timer);
              resolve();
            }
          };

          // Check periodically
          const interval = setInterval(() => {
            checkStatus();
          }, 100);

          // Also check on events
          chatChannel.onEvent(() => {
            checkStatus();
            if (currentStatus === waitFor) {
              clearInterval(interval);
            }
          });
        });

        logInfo("Reached target status", { status: currentStatus });
      }

      // Small delay to capture any final events
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Cleanup
      chatChannel.leave();
      socketClient.disconnect();
    } catch (error) {
      logError("Send command failed", { error: String(error) });
      process.exit(1);
    }
  });

program
  .command("listen")
  .description("Connect and listen for events without sending messages")
  .requiredOption("-e, --email <email>", "User email")
  .requiredOption("-p, --password <password>", "User password")
  .requiredOption("-w, --workspace <id>", "Workspace ID")
  .requiredOption("-c, --conversation <id>", "Conversation ID to listen to")
  .option("-u, --url <url>", "Backend URL", "http://localhost:4000")
  .action(async (options) => {
    logSessionStart({
      command: "listen",
      email: options.email,
      workspace: options.workspace,
      conversation: options.conversation,
      url: options.url,
    });

    try {
      // Authenticate
      const auth = await login(options.email, options.password, options.url);

      // Connect socket
      const socketUrl = options.url.replace(/^http/, "ws") + "/socket";
      const socketClient = createSocketClient(socketUrl, auth.socketToken);
      await socketClient.connect();

      // Create and join channel
      const chatChannel = createChatChannel(
        socketClient.socket,
        options.conversation,
        options.workspace
      );

      await chatChannel.join();

      // Just listen for events
      chatChannel.onEvent(() => {
        // Events are already logged by the channel
      });

      logInfo("Listening for events. Press Ctrl+C to exit.");

      // Keep running until interrupted
      await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
          chatChannel.leave();
          socketClient.disconnect();
          resolve();
        });
      });
    } catch (error) {
      logError("Listen command failed", { error: String(error) });
      process.exit(1);
    }
  });

program.parse();
