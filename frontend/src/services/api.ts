import axios from "axios";
import type { AxiosError } from "axios";

import type { ApiError } from "@/types/api";

const DEFAULT_API_BASE_URL =
  "http://localhost:8080";

const ACCESS_TOKEN_STORAGE_KEY =
  "finance-ai:access-token";

const configuredApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.trim();

export const API_BASE_URL = (
  configuredApiBaseUrl || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    return config;
  }

  const accessToken = window.localStorage.getItem(
    ACCESS_TOKEN_STORAGE_KEY,
  );

  if (accessToken) {
    config.headers.Authorization =
      `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) =>
    Promise.reject(error),
);

export function saveAccessToken(
  accessToken: string,
): void {
  window.localStorage.setItem(
    ACCESS_TOKEN_STORAGE_KEY,
    accessToken,
  );
}

export function getAccessToken(): string | null {
  return window.localStorage.getItem(
    ACCESS_TOKEN_STORAGE_KEY,
  );
}

export function removeAccessToken(): void {
  window.localStorage.removeItem(
    ACCESS_TOKEN_STORAGE_KEY,
  );
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage =
    "Não foi possível concluir a solicitação.",
): string {
  if (!axios.isAxiosError<ApiError>(error)) {
    return fallbackMessage;
  }

  return (
    error.response?.data?.message ||
    error.message ||
    fallbackMessage
  );
}
