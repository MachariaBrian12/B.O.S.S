import { apiClient } from "./apiClient";

export const api = {
  login: (email: string, password: string) =>
    apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, business: string) =>
    apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, business }),
    }),

  me: (token: string) =>
    apiClient("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getInsights: (token: string) =>
    apiClient("/insights/daily", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getWeek: (token: string) =>
    apiClient("/business/week", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getSignals: (token: string) =>
    apiClient("/insights/signals", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getToday: (token: string) =>
    apiClient("/business/today", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getHistory: (token: string, limit: number) =>
    apiClient(`/business/history?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addEntry: (token: string, data: any) =>
    apiClient("/business/entry", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  logout: (token: string) =>
    apiClient("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
