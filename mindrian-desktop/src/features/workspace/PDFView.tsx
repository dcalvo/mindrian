import React from "react";

interface PDFViewProps {
  url: string; // File path (usually file://...)
}

export const PDFView: React.FC<PDFViewProps> = ({ url }) => {
  // Convert OS path to file:// protocol if not already
  const fileUrl =
    url.startsWith("file://") || url.startsWith("http") ? url : `file://${url}`;

  console.log("PDFView mounting with:", {
    original: url,
    transformed: fileUrl,
  });

  return (
    <div
      className="pdf-viewer-container"
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-secondary, #F9FAFB)",
        overflow: "hidden",
      }}
    >
      <embed
        src={fileUrl}
        type="application/pdf"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};
