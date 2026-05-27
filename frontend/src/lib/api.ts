const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";

const req = async (method: string, path: string, body?: object, token?: string) => {
  const headers: Record<string,string> = { "Content-Type":"application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    method, headers, credentials:"include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
};

export const api = {
  register:    (name:string,email:string,password:string,business:string) => req("POST","/auth/register",{name,email,password,business}),
  login:       (email:string,password:string)                              => req("POST","/auth/login",{email,password}),
  logout:      (token:string)                                              => req("POST","/auth/logout",{},token),
  me:          (token:string)                                              => req("GET", "/auth/me",undefined,token),
  addEntry:    (sales:number,expenses:number,notes:string,token:string)    => req("POST","/business/entry",{sales,expenses,notes},token),
  getToday:    (token:string)                                              => req("GET", "/business/today",undefined,token),
  getHistory:  (token:string,limit=30)                                     => req("GET", `/business/history?limit=${limit}`,undefined,token),
  getWeek:     (token:string)                                              => req("GET", "/business/week",undefined,token),
  getInsights: (token:string)                                              => req("GET", "/insights/daily",undefined,token),
  getSignals:  (token:string)                                              => req("GET", "/insights/signals",undefined,token),
  getAlerts:   (token:string)                                              => req("GET", "/insights/alerts",undefined,token),
};
