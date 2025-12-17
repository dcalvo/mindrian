const API_BASE = "/api";

export interface User {
  id: string;
  email: string;
  socket_token: string;
}

export interface Document {
  id: string;
  title: string;
  parent_id: string | null;
  position: number;
  is_folder: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiError {
  error: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "API request failed");
  }

  return response.json();
}

export async function getMe(): Promise<User> {
  return fetchApi<User>("/me");
}

export async function checkHealth(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>("/health");
}

// Document API

interface DocumentsResponse {
  documents: Document[];
}

interface DocumentResponse {
  document: Document;
}

export async function listDocuments(): Promise<Document[]> {
  const response = await fetchApi<DocumentsResponse>("/documents");
  return response.documents;
}

export async function getDocument(id: string): Promise<Document> {
  const response = await fetchApi<DocumentResponse>(`/documents/${id}`);
  return response.document;
}

export async function createDocument(
  title?: string,
  parentId?: string | null
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>("/documents", {
    method: "POST",
    body: JSON.stringify({
      document: { title: title || "Untitled", parent_id: parentId || null },
    }),
  });
  return response.document;
}

export async function createFolder(
  title?: string,
  parentId?: string | null
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>("/documents", {
    method: "POST",
    body: JSON.stringify({
      document: {
        title: title || "New Folder",
        parent_id: parentId || null,
        is_folder: true,
      },
    }),
  });
  return response.document;
}

export async function updateDocument(
  id: string,
  title: string
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>(`/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ document: { title } }),
  });
  return response.document;
}

export async function moveDocument(
  id: string,
  parentId: string | null,
  position: number
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>(`/documents/${id}/move`, {
    method: "PUT",
    body: JSON.stringify({ document: { parent_id: parentId, position } }),
  });
  return response.document;
}

export async function deleteDocument(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete document");
  }
}
