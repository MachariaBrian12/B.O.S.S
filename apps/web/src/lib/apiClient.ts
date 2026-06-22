// Use the environment variable in all environments.
// In development this is http://localhost:4000/api/v1
// In production set NEXT_PUBLIC_API_URL in your Vercel/Railway dashboard.
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export async function apiClient(url: string, options: RequestInit = {}) {
  const requestId =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      // credentials: "include" sends the httpOnly cookie the API sets on login.
      // Without this the browser strips the cookie from cross-origin requests
      // and every protected route returns 401.
      credentials: 'include',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': requestId,
        ...(options.headers || {}),
      },
    });

    clearTimeout(timeout);

    // Handle non-JSON error responses (e.g. 502 gateway errors return HTML)
    const contentType = res.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || 'Request failed');
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw new Error(err.message || 'Network error');
  }
}
