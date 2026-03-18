"use client";

export type ApiEnvelope<T> = { code: number; message: string; data: T };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:8000";

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });
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
  const data = await apiFetch<{ token: string; expiresIn: number; user: any }>(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ account, password }),
    }
  );
  if (typeof window !== "undefined") {
    localStorage.setItem("token", data.token);
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

export const getCardholders = (params: URLSearchParams) =>
  apiFetch<Paged<any>>(`/api/cards/cardholders?${params.toString()}`);

