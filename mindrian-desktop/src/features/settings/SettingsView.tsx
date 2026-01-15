import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Key, Save, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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

export const SettingsView: React.FC = () => {
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    // Check if key already exists on mount
    const checkKey = async () => {
      if (window.ai) {
        const exists = await window.ai.checkKey();
        setHasStoredKey(exists);
      }
    };
    checkKey();
  }, []);

  const handleSaveKey = async () => {
    if (!apiKey.trim()) return;

    try {
      setIsSaving(true);
      if (window.ai) {
        await window.ai.setKey(apiKey);
        setHasStoredKey(true);
        setApiKey(""); // Clear input after save for security
        toast.success("Gemini API Key saved securely.");
      } else {
        throw new Error("AI interface not available");
      }
    } catch (error: unknown) {
      console.error("Failed to save API key", error);
      toast.error("Failed to save API key.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      className="settings-view"
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
      variants={CONTAINER_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="settings-header">
        <motion.h1 variants={ITEM_VARIANTS} className="view-title">
          Settings
        </motion.h1>
        <motion.p
          variants={ITEM_VARIANTS}
          className="view-subtitle"
          style={{ marginBottom: "32px" }}
        >
          Configure your personal preferences and AI integrations.
        </motion.p>
      </div>

      <motion.section variants={ITEM_VARIANTS} className="settings-section">
        <div className="settings-card">
          <div className="settings-group-title">
            <Key size={20} style={{ color: "var(--preview-text-primary)" }} />
            <span>Gemini AI Integration</span>
          </div>

          <p
            style={{
              fontSize: "14px",
              color: "var(--preview-text-secondary)",
              marginBottom: "24px",
              lineHeight: "1.6",
            }}
          >
            Mindrian uses Gemini to power local agentic features. Your API key
            is encrypted using your OS keychain and stored locally on your
            device.
          </p>

          <div className="input-group">
            <label htmlFor="api-key">Gemini API Key</label>
            <div style={{ position: "relative" }}>
              <input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={
                  hasStoredKey ? "••••••••••••••••" : "Paste your API key here"
                }
                style={{ width: "100%" }}
              />
              {hasStoredKey && !apiKey && (
                <div
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#059669",
                    fontSize: "12px",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle size={14} />
                  Configured
                </div>
              )}
            </div>
          </div>

          <motion.button
            className="create-confirm-button"
            disabled={!apiKey.trim() || isSaving}
            onClick={handleSaveKey}
            style={{ width: "100%", marginTop: "24px" }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save size={16} />
                {hasStoredKey ? "Update API Key" : "Save API Key"}
              </>
            )}
          </motion.button>

          <div
            style={{
              marginTop: "16px",
              display: "flex",
              alignItems: "start",
              gap: "8px",
              padding: "12px",
              borderRadius: "10px",
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
            }}
          >
            <AlertCircle
              size={14}
              style={{ color: "#64748b", marginTop: "2px", flexShrink: 0 }}
            />
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                color: "#64748b",
                lineHeight: "1.5",
              }}
            >
              Don't have a key? You can get one for free at{" "}
              <a
                href="https://aistudio.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--preview-text-primary)",
                  fontWeight: 600,
                }}
              >
                Google AI Studio
              </a>
              .
            </p>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};
