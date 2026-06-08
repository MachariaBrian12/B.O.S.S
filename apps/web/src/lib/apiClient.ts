const BASE_URL = "https://boss-production-75ce.up.railway.app/api/v1";

export async function apiClient(url: string, options: RequestInit = {}) {
  const requestId =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "x-request-id": requestId,
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeout);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Request failed");
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeout);
    throw new Error(err.message || "Network error");
  }
}
