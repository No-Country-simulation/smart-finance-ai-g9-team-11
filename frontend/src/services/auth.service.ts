import {
  api,
  getAccessToken,
  removeAccessToken,
  saveAccessToken,
} from "@/services/api";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/types/auth";

const LOGIN_ENDPOINT = "/auth/login";
const USERS_ENDPOINT = "/users";
const PROFILE_ENDPOINT = "/users/me";

export async function login(
  credentials: LoginRequest,
): Promise<void> {
  const { data } =
    await api.post<LoginResponse>(
      LOGIN_ENDPOINT,
      credentials,
    );

  if (!data.token) {
    throw new Error(
      "Token de autenticação não retornado pelo servidor.",
    );
  }

  saveAccessToken(data.token);
}

export async function registerUser(
  payload: RegisterRequest,
): Promise<AuthUser> {
  const { data } =
    await api.post<AuthUser>(
      USERS_ENDPOINT,
      payload,
    );

  return data;
}

export async function getProfile(): Promise<AuthUser> {
  const { data } =
    await api.get<AuthUser>(
      PROFILE_ENDPOINT,
    );

  return data;
}

export function logout(): void {
  removeAccessToken();
}

export function hasStoredToken(): boolean {
  return Boolean(
    getAccessToken(),
  );
}