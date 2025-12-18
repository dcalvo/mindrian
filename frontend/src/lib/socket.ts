import { Socket, Channel } from "phoenix";

let socket: Socket | null = null;
let socketToken: string | null = null;

export function setSocketToken(token: string): void {
  socketToken = token;
}

export function isSocketReady(): boolean {
  return socketToken !== null;
}

export function getSocket(): Socket {
  if (!socket) {
    if (!socketToken) {
      throw new Error("Socket token not set. Call setSocketToken() first.");
    }
    socket = new Socket("/socket", {
      params: { token: socketToken },
    });
    socket.connect();
  }
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function joinChannel(
  topic: string,
  params: object = {}
): Promise<Channel> {
  const socket = getSocket();
  const channel = socket.channel(topic, params);

  return new Promise((resolve, reject) => {
    channel
      .join()
      .receive("ok", () => resolve(channel))
      .receive("error", (resp) => reject(new Error(JSON.stringify(resp))));
  });
}

export function sendPing(channel: Channel): Promise<{ message: string }> {
  return new Promise((resolve, reject) => {
    channel
      .push("ping", {})
      .receive("ok", (resp) => resolve(resp))
      .receive("error", (resp) => reject(new Error(JSON.stringify(resp))));
  });
}
