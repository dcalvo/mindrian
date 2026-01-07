import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  TrendingUp,
  Code,
  BookOpen,
  Terminal,
  Cpu,
  Globe,
  Zap,
  Plus,
} from "lucide-react";
import { usePreviewContext } from "../../contexts/PreviewContext";

const AVAILABLE_ICONS = [
  { id: "briefcase", icon: Briefcase },
  { id: "trending-up", icon: TrendingUp },
  { id: "code", icon: Code },
  { id: "book-open", icon: BookOpen },
  { id: "terminal", icon: Terminal },
  { id: "cpu", icon: Cpu },
  { id: "globe", icon: Globe },
  { id: "zap", icon: Zap },
];

const CONTAINER_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20 },
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export const CreateWorkspaceView: React.FC = () => {
  const { addWorkspace } = usePreviewContext();
  const [name, setName] = useState("");
  const [selectedIconId, setSelectedIconId] = useState("briefcase");

  const handleCreate = () => {
    if (!name.trim()) return;

    const iconObj = AVAILABLE_ICONS.find((i) => i.id === selectedIconId);
    if (!iconObj) return;

    addWorkspace({
      name,
      icon: iconObj.icon,
      bgColor: "#000000",
      iconColor: "#ffffff",
    });
  };

  return (
    <motion.div
      className="create-workspace-view"
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.h1 variants={ITEM_VARIANTS} className="view-title">
        New Workspace
      </motion.h1>
      <motion.p variants={ITEM_VARIANTS} className="view-subtitle">
        Give your workspace a name and choose an icon to get started.
      </motion.p>

      <motion.div variants={ITEM_VARIANTS} className="input-group">
        <label htmlFor="ws-name">Workspace Name</label>
        <input
          id="ws-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Project Phoenix"
          autoFocus
        />
      </motion.div>

      <motion.div variants={ITEM_VARIANTS} className="icon-selector-group">
        <label>Choose an Icon</label>
        <div className="icon-grid-selector">
          {AVAILABLE_ICONS.map(({ id, icon: Icon }) => (
            <motion.button
              key={id}
              className={`icon-option ${selectedIconId === id ? "selected" : ""}`}
              onClick={() => setSelectedIconId(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={24} />
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.button
        variants={ITEM_VARIANTS}
        className="create-confirm-button"
        disabled={!name.trim()}
        onClick={handleCreate}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus size={18} />
        Create Workspace
      </motion.button>
    </motion.div>
  );
};
