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

/** 清除本地 JWT（登出时调用） */
export function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

/** 未授权时跳转登录（避免在 /login 上死循环） */
function redirectToLoginIfNeeded() {
  if (typeof window === "undefined") return;
  const pathname = window.location.pathname || "";
  if (pathname.startsWith("/login")) return;
  window.location.assign("/login");
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

  const skipAuthRedirect =
    path.startsWith("/api/auth/login") || path === "/api/auth/refresh";

  if (res.status === 401 && retryOn401 && !skipAuthRedirect) {
    const refreshed = await tryRefreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, options, false);
    }
  }

  if (res.status === 401 && !skipAuthRedirect) {
    clearAuth();
    redirectToLoginIfNeeded();
  }

  const json: ApiEnvelope<T> = await res.json().catch(() => ({
    code: res.status,
    message: res.statusText,
    data: null as unknown as T,
  }));
  if (!res.ok || json.code !== 0) {
    const msg = json?.message || `${res.status} ${res.statusText}`;
    throw new Error(msg);
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
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ account, password }),
  });
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.token);
    if (data.refreshToken) {
      localStorage.setItem(REFRESH_KEY, data.refreshToken);
    }
  }
  return data;
}

// Wallet
export type WalletOverview = {
  walletAccountId: string;
  maskedCardNumber: string;
  balance: string;
  frozenAmount: string;
  totalRecharge: string;
  totalConsume: string;
  totalWithdraw: string;
  cardStats: Array<any>;
};
export const getWalletOverview = () => apiFetch<WalletOverview>("/api/wallet/overview");

// Generic list response
export type Paged<T> = { list: T[]; total: number };

export const getRechargeRecords = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/recharge-records?${params.toString()}`);

export const getTransactions = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/transactions?${params.toString()}`);

export const getRefundDetails = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/refund-details?${params.toString()}`);

export const getCards = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/list?${params.toString()}`);

export type CardholderRow = {
  id: number;
  subAccount: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  state: string;
  city: string;
  address: string;
  zip: string;
  remark: string;
};

export type CardholderInput = Omit<CardholderRow, "id">;

export const getCardholders = (params: URLSearchParams) =>
  apiFetch<Paged<CardholderRow>>(`/api/cards/cardholders?${params.toString()}`);

export const createCardholder = (body: CardholderInput) =>
  apiFetch<CardholderRow>("/api/cards/cardholders", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const getCardholder = (id: number) =>
  apiFetch<CardholderRow>(`/api/cards/cardholders/${id}`);

export const updateCardholder = (id: number, body: Partial<CardholderInput>) =>
  apiFetch<CardholderRow>(`/api/cards/cardholders/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });

export const deleteCardholder = (id: number) =>
  apiFetch<{ ok: boolean; id: number }>(`/api/cards/cardholders/${id}`, {
    method: "DELETE",
  });
