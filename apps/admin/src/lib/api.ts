"use client";

export type ApiEnvelope<T> = { code: number; message: string; data: T };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

const TOKEN_KEY = "token";
const REFRESH_KEY = "refreshToken";

function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function tryRefreshAccessToken(): Promise<boolean> {
  const refresh = getRefreshToken();
  if (!refresh) return false;
  try {
    const res = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refresh}`,
      },
      cache: "no-store",
    });
    const json: ApiEnvelope<{
      token: string;
      refreshToken?: string;
      expiresIn: number;
    }> = await res.json().catch(() => ({
      code: res.status,
      message: res.statusText,
      data: null as any,
    }));
    if (!res.ok || json.code !== 0 || !json.data?.token) {
      clearAuth();
      return false;
    }
    localStorage.setItem(TOKEN_KEY, json.data.token);
    if (json.data.refreshToken) {
      localStorage.setItem(REFRESH_KEY, json.data.refreshToken);
    }
    return true;
  } catch {
    clearAuth();
    return false;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  retryOn401 = true
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (
    res.status === 401 &&
    retryOn401 &&
    !path.startsWith("/api/auth/login") &&
    path !== "/api/auth/refresh"
  ) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, options, false);
    }
  }

  const json: ApiEnvelope<T> = await res.json().catch(() => ({
    code: res.status,
    message: res.statusText,
    data: null as unknown as T,
  }));
  if (!res.ok || json.code !== 0) {
    throw new Error(json?.message || `${res.status} ${res.statusText}`);
  }
  return json.data;
}

export async function login(account: string, password: string) {
  clearAuth();
  const data = await apiFetch<{
    token: string;
    refreshToken: string;
    expiresIn: number;
    user: any;
  }>("/api/auth/login", { method: "POST", body: JSON.stringify({ account, password }) });
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.token);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
    }
  }
  return data;
}

export type Paged<T> = { list: T[]; total: number };

export const getUsers = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/account/sub-accounts?${params.toString()}`);

export const getCards = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/list?${params.toString()}`);
