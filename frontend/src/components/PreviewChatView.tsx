import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type { Agent, Message } from "../hooks/chat/usePreviewChat";

interface PreviewChatViewProps {
  messages: Message[];
  selectedAgent: Agent;
  chatInput: string;
  setChatInput: (input: string) => void;
  sendMessage: () => void;
}

export const PreviewChatView: React.FC<PreviewChatViewProps> = ({
  messages,
  selectedAgent,
  chatInput,
  setChatInput,
  sendMessage,
}) => {
  return (
    <motion.div
      key="chat-messages-view"
      className="chat-messages-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div className="chat-messages" style={{ flex: 1 }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`message ${msg.sender}`}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
              }}
            >
              {msg.sender === "agent" && (
                <div
                  className="message-avatar"
                  style={{ backgroundColor: selectedAgent.color }}
                >
                  {selectedAgent.name[0]}
                </div>
              )}
              <div className="message-bubble">{msg.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div
        className="chat-action-container active-chat"
        style={{ width: "100%", marginTop: "20px" }}
      >
        <motion.div
          layout
          className="chat-input-wrapper-new chat-active"
          whileHover={{ boxShadow: `0 8px 30px rgba(0, 0, 0, 0.08)` }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
        >
          <textarea
            className="chat-input"
            placeholder={`Discuss with ${selectedAgent.name}...`}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            autoFocus
            rows={2}
          />
          <div className="chat-footer">
            <motion.button
              className="send-button-inline"
              style={{ backgroundColor: selectedAgent.color }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!chatInput.trim()}
              onClick={sendMessage}
            >
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
