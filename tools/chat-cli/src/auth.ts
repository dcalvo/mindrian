// Authentication module for logging in and getting socket token

import { logError, logInfo } from "./output.js";

export interface AuthResult {
  sessionCookie: string;
  socketToken: string;
}

interface MeResponse {
  id: string;
  email: string;
  socket_token: string;
}

export async function login(
  email: string,
  password: string,
  baseUrl: string
): Promise<AuthResult> {
  // Step 1: Login via dev API to get session cookie (no CSRF required)
  const loginUrl = `${baseUrl}/dev/api/login`;
  logInfo("Logging in", { email, url: loginUrl });

  const loginResponse = await fetch(loginUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!loginResponse.ok) {
    const body = await loginResponse.text();
    logError("Login failed", { status: loginResponse.status, body });
    throw new Error(`Login failed: ${loginResponse.status} - ${body}`);
  }

  // Extract session cookie from Set-Cookie header
  const setCookie = loginResponse.headers.get("set-cookie");
  if (!setCookie) {
    logError("Login failed - no session cookie in response");
    throw new Error("Login failed: no session cookie returned");
  }

  // Parse the session cookie (_mindrian_key or _mindrian_web_key)
  const cookieMatch = setCookie.match(/(_mindrian_(?:web_)?key)=([^;]+)/);
  if (!cookieMatch) {
    logError("Login failed - session cookie not found in response", { setCookie });
    throw new Error("Login failed: session cookie not found");
  }

  const sessionCookie = `${cookieMatch[1]}=${cookieMatch[2]}`;
  logInfo("Login successful, got session cookie");

  // Step 2: Get socket token from /api/me
  const socketToken = await getSocketToken(sessionCookie, baseUrl);

  return { sessionCookie, socketToken };
}

export async function getSocketToken(
  sessionCookie: string,
  baseUrl: string
): Promise<string> {
  const meUrl = `${baseUrl}/api/me`;
  logInfo("Fetching socket token", { url: meUrl });

  const meResponse = await fetch(meUrl, {
    headers: {
      Cookie: sessionCookie,
      Accept: "application/json",
    },
  });

  if (!meResponse.ok) {
    const body = await meResponse.text();
    logError("Failed to get /api/me", { status: meResponse.status, body });
    throw new Error(`Failed to get /api/me: ${meResponse.status}`);
  }

  const meData = (await meResponse.json()) as MeResponse;
  const socketToken = meData.socket_token;

  if (!socketToken) {
    logError("No socket_token in /api/me response", { data: meData });
    throw new Error("No socket_token in /api/me response");
  }

  logInfo("Got socket token", { userId: meData.id, email: meData.email });
  return socketToken;
}
