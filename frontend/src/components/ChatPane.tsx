import { useState, useEffect } from "react";
import { joinChannel, sendPing } from "../lib/socket";
import { Channel } from "phoenix";

export function ChatPane() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");
  const [lastPong, setLastPong] = useState<string | null>(null);

  useEffect(() => {
    joinChannel("ping:lobby")
      .then((ch) => {
        setChannel(ch);
        setConnectionStatus("Connected");
      })
      .catch((err) => {
        setConnectionStatus(`Error: ${err.message}`);
      });
  }, []);

  const handlePing = async () => {
    if (!channel) return;
    try {
      const response = await sendPing(channel);
      setLastPong(
        `Received: ${response.message} at ${new Date().toLocaleTimeString()}`
      );
    } catch (err) {
      setLastPong(`Error: ${err}`);
    }
  };

  return (
    <aside className="chat-pane">
      <h3>Chat</h3>
      <div style={{ marginBottom: "1rem" }}>
        <p>
          <strong>Socket:</strong> {connectionStatus}
        </p>
        {channel && (
          <>
            <button onClick={handlePing} style={{ marginTop: "0.5rem" }}>
              Send Ping
            </button>
            {lastPong && <p style={{ marginTop: "0.5rem" }}>{lastPong}</p>}
          </>
        )}
      </div>
      <p className="placeholder">Chat with AI assistant coming soon...</p>
    </aside>
  );
}
