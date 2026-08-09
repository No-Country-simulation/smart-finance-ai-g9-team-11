import { api, saveAccessToken, removeAccessToken } from "@/services/api";
import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
} from "@/types/auth";

const AUTH_ENDPOINT = "/auth/login";

function parseJwt(token: string): Record<string, unknown> {
  const base64Payload = token.split(".")[1];

  if (!base64Payload) {
    throw new Error("Token JWT inválido.");
  }

  const payload = atob(
    base64Payload.replace(/-/g, "+").replace(/_/g, "/"),
  );

  return JSON.parse(payload);
}

export async function login(
  credentials: LoginRequest,
): Promise<AuthUser> {
  const { data } = await api.post<LoginResponse>(
    AUTH_ENDPOINT,
    credentials,
  );

  saveAccessToken(data.token);

  const payload = parseJwt(data.token);

  return {
    email: String(payload.sub),
  };
}

export function logout(): void {
  removeAccessToken();
}

export function getAuthenticatedUser(): AuthUser | null {
  const token = window.localStorage.getItem(
    "finance-ai:access-token",
  );

  if (!token) {
    return null;
  }

  try {
    const payload = parseJwt(token);

    return {
      email: String(payload.sub),
    };
  } catch {
    removeAccessToken();
    return null;
  }
}