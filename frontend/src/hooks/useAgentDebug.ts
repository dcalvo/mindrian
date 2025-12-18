import { useEffect, useRef } from "react";
import { getSocket, isSocketReady } from "../lib/socket";
import type { Channel } from "phoenix";

interface DebugEvent {
  event: string;
  timestamp: number;
  metadata: Record<string, unknown>;
}

const EVENT_COLORS: Record<string, string> = {
  // Session events
  session_started: "#22c55e", // green
  session_timeout: "#ef4444", // red

  // Message flow
  message_received: "#3b82f6", // blue
  message_rejected: "#f97316", // orange

  // Status changes
  status_changed: "#8b5cf6", // purple

  // Task lifecycle
  task_started: "#06b6d4", // cyan
  task_completed: "#10b981", // emerald
  task_crashed: "#dc2626", // red

  // API calls
  api_request: "#f59e0b", // amber
  api_call_completed: "#84cc16", // lime
  api_response: "#84cc16", // lime
  api_error: "#ef4444", // red
  api_exception: "#dc2626", // red

  // Tool flow
  tool_requested: "#ec4899", // pink
  tool_approved: "#22c55e", // green
  tool_rejected: "#ef4444", // red
  tool_executed: "#14b8a6", // teal

  // PubSub
  pubsub_broadcast: "#6b7280", // gray

  // Cancelled
  cancelled: "#f97316", // orange
};

function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
  });
}

function logDebugEvent(event: DebugEvent) {
  const color = EVENT_COLORS[event.event] || "#9ca3af";
  const timestamp = formatTimestamp(event.timestamp);

  console.groupCollapsed(
    `%c[Agent] %c${timestamp} %c${event.event}`,
    "color: #6366f1; font-weight: bold",
    "color: #6b7280",
    `color: ${color}; font-weight: bold`
  );

  if (Object.keys(event.metadata).length > 0) {
    console.table(event.metadata);
  }

  console.groupEnd();
}

/**
 * Hook to subscribe to agent debug events in development.
 * Events are logged to the browser console with color-coded formatting.
 *
 * @param enabled - Whether to enable the debug channel (typically isAuthenticated)
 *
 * Usage:
 * ```tsx
 * function App() {
 *   const { isAuthenticated } = useAuth();
 *   useAgentDebug(isAuthenticated);
 *   return <div>...</div>;
 * }
 * ```
 */
export function useAgentDebug(enabled: boolean = false) {
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    // Only enable in development when authenticated
    if (import.meta.env.PROD || !enabled) {
      return;
    }

    // Wait for socket to be ready
    if (!isSocketReady()) {
      return;
    }

    const socket = getSocket();
    const channel = socket.channel("debug:agent", {});
    channelRef.current = channel;

    channel.on("debug_event", (payload: DebugEvent) => {
      logDebugEvent(payload);
    });

    channel
      .join()
      .receive("ok", () => {
        console.log(
          "%c[Agent Debug] %cConnected to debug channel",
          "color: #6366f1; font-weight: bold",
          "color: #22c55e"
        );
      })
      .receive("error", (resp) => {
        console.warn("[Agent Debug] Failed to join debug channel:", resp);
      });

    return () => {
      channel.leave();
      channelRef.current = null;
    };
  }, [enabled]);
}
