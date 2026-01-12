const API_BASE = "/api";

export interface User {
  id: string;
  email: string;
  socket_token: string;
}

// =============================================================================
// FILE SYSTEM TYPES
// =============================================================================

export interface Folder {
  id: string;
  title: string;
  parent_folder_id: string | null;
  position: number;
  type: "folder";
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  title: string;
  folder_id: string | null;
  position: number;
  type: "document";
  created_at: string;
  updated_at: string;
}

export interface Workspace {
  id: string;
  title: string;
  icon: string;
  bg_color: string;
  icon_color: string;
  owner_id: string;
  inserted_at: string;
  updated_at: string;
}

export type FileSystemItem = Folder | Document;

export interface ApiError {
  error: string;
}

// =============================================================================
// API HELPERS
// =============================================================================

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

// =============================================================================
// USER API
// =============================================================================

export async function getMe(): Promise<User> {
  return fetchApi<User>("/me");
}

export async function checkHealth(): Promise<{ status: string }> {
  return fetchApi<{ status: string }>("/health");
}

// =============================================================================
// WORKSPACE API
// =============================================================================

interface ListWorkspacesResponse {
  data: Workspace[];
}

interface WorkspaceResponse {
  data: Workspace;
}

export async function listWorkspaces(): Promise<Workspace[]> {
  const response = await fetchApi<ListWorkspacesResponse>("/workspaces");
  return response.data;
}

export async function getWorkspace(id: string): Promise<Workspace> {
  const response = await fetchApi<WorkspaceResponse>(`/workspaces/${id}`);
  return response.data;
}

export async function createWorkspace(
  title: string,
  icon: string,
  bg_color: string,
  icon_color: string
): Promise<Workspace> {
  const response = await fetchApi<WorkspaceResponse>("/workspaces", {
    method: "POST",
    body: JSON.stringify({
      workspace: { title, icon, bg_color, icon_color },
    }),
  });
  return response.data;
}

export async function updateWorkspace(
  id: string,
  updates: Partial<
    Pick<Workspace, "title" | "icon" | "bg_color" | "icon_color">
  >
): Promise<Workspace> {
  const response = await fetchApi<WorkspaceResponse>(`/workspaces/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ workspace: updates }),
  });
  return response.data;
}

export async function deleteWorkspace(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/workspaces/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete workspace");
  }
}

// =============================================================================
// FILE SYSTEM API
// =============================================================================

interface ListResponse {
  folders: Folder[];
  documents: Document[];
}

interface FolderResponse {
  folder: Folder;
}

interface DocumentResponse {
  document: Document;
}

/**
 * Lists all folders and documents for the current user.
 * Optionally filters by workspace_id.
 */
export async function listAll(workspaceId?: string): Promise<ListResponse> {
  const url = workspaceId
    ? `/documents?workspace_id=${encodeURIComponent(workspaceId)}`
    : "/documents";
  return fetchApi<ListResponse>(url);
}

/**
 * Gets a single document by ID.
 */
export async function getDocument(id: string): Promise<Document> {
  const response = await fetchApi<DocumentResponse>(`/documents/${id}`);
  return response.document;
}

/**
 * Creates a new document.
 */
export async function createDocument(
  title?: string,
  folderId?: string | null,
  workspaceId?: string
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>("/documents", {
    method: "POST",
    body: JSON.stringify({
      document: {
        title: title || "Untitled",
        folder_id: folderId || null,
        workspace_id: workspaceId || null,
      },
    }),
  });
  return response.document;
}

/**
 * Creates a new folder.
 */
export async function createFolder(
  title?: string,
  parentFolderId?: string | null,
  workspaceId?: string
): Promise<Folder> {
  const response = await fetchApi<FolderResponse>("/documents", {
    method: "POST",
    body: JSON.stringify({
      document: {
        title: title || "New Folder",
        parent_folder_id: parentFolderId || null,
        workspace_id: workspaceId || null,
        is_folder: true,
      },
    }),
  });
  return response.folder;
}

/**
 * Updates a document's title.
 */
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

/**
 * Updates a folder's title.
 */
export async function updateFolder(id: string, title: string): Promise<Folder> {
  const response = await fetchApi<FolderResponse>(`/documents/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ document: { title } }),
  });
  return response.folder;
}

/**
 * Moves a document to a new folder and/or position.
 */
export async function moveDocument(
  id: string,
  folderId: string | null,
  position: number
): Promise<Document> {
  const response = await fetchApi<DocumentResponse>(`/documents/${id}/move`, {
    method: "PUT",
    body: JSON.stringify({ document: { folder_id: folderId, position } }),
  });
  return response.document;
}

/**
 * Moves a folder to a new parent folder and/or position.
 */
export async function moveFolder(
  id: string,
  parentFolderId: string | null,
  position: number
): Promise<Folder> {
  const response = await fetchApi<FolderResponse>(`/documents/${id}/move`, {
    method: "PUT",
    body: JSON.stringify({
      document: { parent_folder_id: parentFolderId, position },
    }),
  });
  return response.folder;
}

/**
 * Deletes a document or folder by ID.
 */
export async function deleteItem(id: string): Promise<void> {
  const response = await fetch(`${API_BASE}/documents/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Failed to delete item");
  }
}
