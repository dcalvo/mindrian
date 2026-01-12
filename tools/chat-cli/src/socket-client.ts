// Phoenix Socket wrapper for Node.js environment

import { Socket } from "phoenix";
import WebSocket from "ws";
import { logConnected, logDisconnected, logError, logInfo } from "./output.js";

// Phoenix socket expects a global WebSocket
// @ts-expect-error - Adding WebSocket to global for Phoenix
global.WebSocket = WebSocket;

export interface SocketClient {
  socket: Socket;
  connect(): Promise<void>;
  disconnect(): void;
}

export function createSocketClient(
  socketUrl: string,
  token: string
): SocketClient {
  const socket = new Socket(socketUrl, {
    params: { token },
    // Disable automatic reconnect for CLI tool
    reconnectAfterMs: () => 10000,
  });

  return {
    socket,

    connect(): Promise<void> {
      return new Promise((resolve, reject) => {
        socket.onOpen(() => {
          logConnected();
          resolve();
        });

        socket.onError((error) => {
          logError("Socket error", { error: String(error) });
          reject(new Error(`Socket connection error: ${error}`));
        });

        socket.onClose((event: unknown) => {
          const closeEvent = event as { reason?: string } | undefined;
          logDisconnected(closeEvent?.reason || "unknown");
        });

        logInfo("Connecting to socket", { url: socketUrl });
        socket.connect();
      });
    },

    disconnect(): void {
      logInfo("Disconnecting socket");
      socket.disconnect();
    },
  };
}
