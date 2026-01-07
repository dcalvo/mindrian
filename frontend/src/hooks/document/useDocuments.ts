import { useContext } from "react";
import { DocumentsContext } from "../../contexts/documents";

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentsProvider");
  }
  return context;
}
