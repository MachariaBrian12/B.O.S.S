import axios from "axios"

export const api = axios.create({
  baseURL: "http://kijani.local",
  timeout: 5000,
})

export async function fetchApiStatus() {
  const [api1, api2] = await Promise.allSettled([
    api.get("/api/"),
    api.get("/payments/health"),
  ])
  return {
    api: api1.status === "fulfilled" ? api1.value.data : null,
    payments: api2.status === "fulfilled" ? api2.value.data : null,
  }
}
