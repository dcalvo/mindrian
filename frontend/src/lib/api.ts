const API_BASE = "/api";

export interface User {
  id: string;
  email: string;
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
