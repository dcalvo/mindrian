import React, { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  Search,
  Download,
  Star,
  CheckCircle2,
  Globe,
  ShieldCheck,
} from "lucide-react";
// import { usePreviewContext } from "../../contexts/PreviewContext";

interface ExtensionsViewProps {
  itemVariants: Variants;
}

export const ExtensionsView: React.FC<ExtensionsViewProps> = ({
  itemVariants,
}) => {
  // const { extensions } = usePreviewContext();
  const extensions: any[] = [
    {
      id: "dummy",
      name: "Extension Store",
      description: "Browse extensions",
      color: "#666666",
      icon: Search,
      isInstalled: false,
      author: "System",
      downloads: 0,
      rating: 5.0,
      fullDescription: "Connect to backend to see extensions.",
    },
  ];
  const [searchQuery, setSearchQuery] = useState("");
  // const [selectedId, setSelectedId] = useState<string>(extensions[0].id);
  const [selectedId, setSelectedId] = useState<string>(extensions[0]?.id || "");

  const filteredExtensions = extensions.filter(
    (ext) =>
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedExtension =
    extensions.find((ext) => ext.id === selectedId) || extensions[0];

  return (
    <motion.div
      key="extensions-view"
      className="extensions-view"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
          },
        },
      }}
    >
      <div className="extensions-layout">
        {/* Left Panel: Search & List */}
        <motion.div className="extensions-sidebar" variants={itemVariants}>
          <div className="search-container">
            <div className="search-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search extensions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="extensions-list-scroll">
            <div className="extensions-section-label">Suggested</div>
            <div className="extensions-list">
              {filteredExtensions.map((ext) => (
                <motion.div
                  key={ext.id}
                  className={`extension-item-card ${
                    selectedId === ext.id ? "active" : ""
                  }`}
                  onClick={() => setSelectedId(ext.id)}
                  whileHover={{ x: 4 }}
                >
                  <div
                    className="extension-mini-icon"
                    style={{
                      backgroundColor: `${ext.color}15`,
                      color: ext.color,
                    }}
                  >
                    <ext.icon size={18} />
                  </div>
                  <div className="extension-mini-info">
                    <div className="extension-mini-name">
                      {ext.name}
                      {ext.isInstalled && (
                        <CheckCircle2 size={12} className="installed-badge" />
                      )}
                    </div>
                    <div className="extension-mini-desc">{ext.description}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Details */}
        <motion.div className="extensions-details" variants={itemVariants}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedExtension.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="extension-detail-content"
            >
              <div className="extension-detail-header">
                <div
                  className="extension-large-icon"
                  style={{
                    backgroundColor: `${selectedExtension.color}15`,
                    color: selectedExtension.color,
                  }}
                >
                  <selectedExtension.icon size={48} />
                </div>
                <div className="extension-header-main">
                  <div className="extension-title-row">
                    <h1 className="extension-full-name">
                      {selectedExtension.name}
                    </h1>
                    <div className="extension-version">v1.2.4</div>
                  </div>
                  <div className="extension-author-row">
                    <span className="author-name">
                      {selectedExtension.author}
                    </span>
                    <span className="divider">•</span>
                    <span className="download-count">
                      <Download size={14} /> {selectedExtension.downloads}
                    </span>
                    <span className="divider">•</span>
                    <span className="rating">
                      <Star size={14} fill="currentColor" />{" "}
                      {selectedExtension.rating}
                    </span>
                  </div>
                  <div className="extension-actions">
                    <button
                      className={`install-btn ${
                        selectedExtension.isInstalled ? "installed" : ""
                      }`}
                    >
                      {selectedExtension.isInstalled ? "Installed" : "Install"}
                    </button>
                    <button className="secondary-btn">Support</button>
                  </div>
                </div>
              </div>

              <div className="extension-detail-body">
                <div className="detail-tabs">
                  <div className="tab active">Details</div>
                  <div className="tab">Changelog</div>
                  <div className="tab">Reviews</div>
                </div>

                <div className="detail-pane">
                  <p className="full-description">
                    {selectedExtension.fullDescription}
                  </p>

                  <div className="extension-features-grid">
                    <div className="feature-item">
                      <Globe size={18} />
                      <div>
                        <div className="feature-label">Environment</div>
                        <div className="feature-value">Universal</div>
                      </div>
                    </div>
                    <div className="feature-item">
                      <ShieldCheck size={18} />
                      <div>
                        <div className="feature-label">Security</div>
                        <div className="feature-value">Verified Publisher</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};
