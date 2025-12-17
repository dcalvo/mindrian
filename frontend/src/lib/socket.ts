import { Socket, Channel } from "phoenix";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = new Socket("/socket", {
      params: {},
    });
    socket.connect();
  }
  return socket;
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
