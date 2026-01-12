// Type declarations for phoenix package

declare module "phoenix" {
  export interface SocketOptions {
    params?: Record<string, unknown> | (() => Record<string, unknown>);
    transport?: unknown;
    timeout?: number;
    heartbeatIntervalMs?: number;
    reconnectAfterMs?: (tries: number) => number;
    rejoinAfterMs?: (tries: number) => number;
    encode?: (payload: unknown, callback: (encoded: string) => void) => void;
    decode?: (payload: string, callback: (decoded: unknown) => void) => void;
    logger?: (kind: string, msg: string, data: unknown) => void;
  }

  export interface PushResponse {
    receive(
      status: "ok" | "error" | "timeout",
      callback: (response: unknown) => void
    ): PushResponse;
  }

  export class Channel {
    constructor(topic: string, params: object, socket: Socket);
    join(timeout?: number): PushResponse;
    leave(timeout?: number): PushResponse;
    push(event: string, payload: object, timeout?: number): PushResponse;
    on(event: string, callback: (payload: unknown) => void): number;
    off(event: string, ref?: number): void;
    onClose(callback: () => void): void;
    onError(callback: (reason: unknown) => void): void;
  }

  export class Socket {
    constructor(endPoint: string, opts?: SocketOptions);
    connect(): void;
    disconnect(callback?: () => void, code?: number, reason?: string): void;
    channel(topic: string, params?: object): Channel;
    onOpen(callback: () => void): void;
    onClose(callback: (event: unknown) => void): void;
    onError(callback: (error: unknown) => void): void;
    onMessage(callback: (event: unknown) => void): void;
  }
}
