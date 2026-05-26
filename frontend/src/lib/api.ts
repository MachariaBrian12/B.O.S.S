const BASE = "http://localhost:4000/api";

const request = async (method: string, path: string, body?: object, token?: string) => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  register:   (name: string, email: string, password: string, business: string) =>
    request("POST", "/auth/register", { name, email, password, business }),
  login:      (email: string, password: string) =>
    request("POST", "/auth/login", { email, password }),
  logout:     (token: string) =>
    request("POST", "/auth/logout", {}, token),
  me:         (token: string) =>
    request("GET",  "/auth/me", undefined, token),
  addEntry:   (sales: number, expenses: number, notes: string, token: string) =>
    request("POST", "/business/entry", { sales, expenses, notes }, token),
  getToday:   (token: string) =>
    request("GET",  "/business/today", undefined, token),
  getHistory: (token: string, limit = 30) =>
    request("GET",  `/business/history?limit=${limit}`, undefined, token),
  getWeek:    (token: string) =>
    request("GET",  "/business/week", undefined, token),
  getInsights:(token: string) =>
    request("GET",  "/insights/daily", undefined, token),
};
