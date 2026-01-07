import { useState, useCallback } from "react";

export interface Message {
  sender: "agent" | "user";
  text: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  color: string;
}

export const agents: Agent[] = [
  {
    id: "larry",
    name: "Larry",
    description: "Creative Strategist",
    color: "#3b82f6",
  },
  {
    id: "sagir",
    name: "Sagir",
    description: "Technical Expert",
    color: "#10b981",
  },
  {
    id: "Calvo",
    name: "Calvo",
    description: "Business Advisor",
    color: "#8b5cf6",
  },
];

export const usePreviewChat = () => {
  const [isChatMode, setIsChatMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const enterChatMode = useCallback(() => {
    if (!isChatMode) {
      setIsChatMode(true);
      if (messages.length === 0) {
        setMessages([
          {
            sender: "agent",
            text: `Hey there! I'm ${selectedAgent.name}. How can I help you today?`,
          },
        ]);
      }
    }
  }, [isChatMode, messages.length, selectedAgent.name]);

  const exitChatMode = useCallback(() => {
    setIsChatMode(false);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(() => {
    if (chatInput.trim()) {
      setMessages((prev) => [...prev, { sender: "user", text: chatInput }]);
      setChatInput("");
    }
  }, [chatInput]);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      const currentTarget = e.currentTarget;
      setTimeout(() => {
        if (
          !currentTarget.parentElement?.contains(document.activeElement) &&
          !chatInput.trim() &&
          messages.length <= 1
        ) {
          setIsChatMode(false);
          setMessages([]);
        }
      }, 100);
    },
    [chatInput, messages.length]
  );

  return {
    isChatMode,
    setIsChatMode,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedAgent,
    setSelectedAgent,
    chatInput,
    setChatInput,
    messages,
    enterChatMode,
    exitChatMode,
    sendMessage,
    handleBlur,
    agents,
  };
};
