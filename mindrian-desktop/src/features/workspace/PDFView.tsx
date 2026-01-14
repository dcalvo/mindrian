import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF worker for Vite
// This uses the ES module worker which bundles nicely or is served by Vite correctly
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface PDFViewProps {
  url: string; // File path (usually file://...)
}

export const PDFView: React.FC<PDFViewProps> = ({ url }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reset state when URL changes
  useEffect(() => {
    setPageNumber(1);
    setLoading(true);
    setError(null);
  }, [url]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF Load Error:", error);
    setLoading(false);
    setError(error.message);
  }

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) =>
      Math.min(Math.max(1, prevPageNumber + offset), numPages)
    );
  };

  const changeScale = (delta: number) => {
    setScale((prevScale) => Math.min(Math.max(0.5, prevScale + delta), 3.0));
  };

  // Convert OS path to file:// protocol if not already
  const fileUrl =
    url.startsWith("file://") || url.startsWith("http") ? url : `file://${url}`;

  return (
    <div
      className="pdf-viewer-container"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-secondary, #F9FAFB)",
        color: "var(--text-primary, #111827)",
      }}
    >
      {/* Toolbar */}
      <div
        className="pdf-toolbar"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          borderBottom: "1px solid var(--border-color, #E5E7EB)",
          backgroundColor: "var(--bg-primary, #FFFFFF)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontWeight: 600, fontSize: "14px" }}>
            {numPages > 0 ? `Page ${pageNumber} of ${numPages}` : "Loading..."}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1 || loading}
              className="icon-btn-ghost"
              style={{ opacity: pageNumber <= 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => changePage(1)}
              disabled={pageNumber >= numPages || loading}
              className="icon-btn-ghost"
              style={{ opacity: pageNumber >= numPages ? 0.5 : 1 }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button onClick={() => changeScale(-0.1)} className="icon-btn-ghost">
            <ZoomOut size={20} />
          </button>
          <span
            style={{ fontSize: "14px", minWidth: "48px", textAlign: "center" }}
          >
            {Math.round(scale * 100)}%
          </span>
          <button onClick={() => changeScale(0.1)} className="icon-btn-ghost">
            <ZoomIn size={20} />
          </button>
        </div>
      </div>

      {/* Document View */}
      <div
        className="pdf-scroll-area"
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          justifyContent: "center",
          padding: "32px",
          position: "relative",
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              color: "var(--text-tertiary, #9CA3AF)",
            }}
          >
            <Loader2 className="animate-spin" size={32} />
            <span>Loading PDF...</span>
          </div>
        )}

        {error && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
              color: "#EF4444",
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            <AlertCircle size={32} />
            <span style={{ fontWeight: 600 }}>Failed to load PDF</span>
            <span style={{ fontSize: 14 }}>{error}</span>
          </div>
        )}

        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          options={{
            cMapUrl: "cmaps/",
            cMapPacked: true,
          }}
          loading={null}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            {numPages > 0 && (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            )}
          </motion.div>
        </Document>
      </div>
    </div>
  );
};
