import {
  api,
  saveAccessToken,
  removeAccessToken,
  getAccessToken,
} from "@/services/api";
import type {
  LoginRequest,
  LoginResponse,
  AuthUser,
} from "@/types/auth";

const AUTH_ENDPOINT = "/auth/login";

export async function login(
  credentials: LoginRequest,
): Promise<void> {
  const { data } = await api.post<LoginResponse>(
    AUTH_ENDPOINT,
    credentials,
  );

  saveAccessToken(data.token);
}

export async function getProfile(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>("/users/me");
  return data;
}

export function logout(): void {
  removeAccessToken();
}

export function hasStoredToken(): boolean {
  return !!getAccessToken();
}