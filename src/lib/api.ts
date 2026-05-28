import { apiClient } from "./apiClient";

export const api = {
  login: (email: string, password: string) =>
    apiClient("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, business: string) =>
    apiClient("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, business }),
    }),

  me: (token: string) =>
    apiClient("/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getInsights: (token: string) =>
    apiClient("/insights", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getWeek: (token: string) =>
    apiClient("/week", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getSignals: (token: string) =>
    apiClient("/signals", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getToday: (token: string) =>
    apiClient("/today", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getHistory: (token: string, limit: number) =>
    apiClient(`/history?limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  addEntry: (token: string, data: any) =>
    apiClient("/entry", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  logout: (token: string) =>
    apiClient("/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),
};
