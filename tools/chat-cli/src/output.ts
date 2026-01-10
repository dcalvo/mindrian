// NDJSON output formatter for AI-friendly event logging

export function logEvent(event: { event: string } & Record<string, unknown>): void {
  const output = {
    ts: new Date().toISOString(),
    ...event,
  };
  console.log(JSON.stringify(output));
}

export function logConnected(): void {
  logEvent({ event: "connected" });
}

export function logDisconnected(reason?: string): void {
  logEvent({ event: "disconnected", reason });
}

export function logJoined(channel: string, reply: unknown): void {
  logEvent({ event: "joined", channel, reply });
}

export function logJoinError(channel: string, error: unknown): void {
  logEvent({ event: "join_error", channel, error });
}

export function logChannelEvent(payload: Record<string, unknown>): void {
  logEvent({ event: "channel_event", ...payload });
}

export function logPushSent(
  ref: string,
  eventName: string,
  payload: unknown
): void {
  logEvent({ event: "push_sent", ref, push_event: eventName, payload });
}

export function logPushReply(ref: string, status: string, reply?: unknown): void {
  logEvent({ event: "push_reply", ref, status, reply });
}

export function logError(message: string, details?: unknown): void {
  logEvent({ event: "error", message, details });
}

export function logInfo(message: string, details?: unknown): void {
  logEvent({ event: "info", message, details });
}

export function logSessionStart(config: Record<string, unknown>): void {
  logEvent({ event: "session_start", ...config });
}

export function logSessionEnd(summary: Record<string, unknown>): void {
  logEvent({ event: "session_end", summary });
}
