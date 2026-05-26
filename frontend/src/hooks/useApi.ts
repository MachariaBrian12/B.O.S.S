import { api } from "../lib/api"

export async function getStatus() {
  const res = await api.get("/api/status")
  return res.data
}

export async function getInventory() {
  const res = await api.get("/api/inventory")
  return res.data
}

export async function getInsights() {
  const res = await api.get("/api/ai/insights")
  return res.data
}

export async function getAnalytics() {
  const res = await api.get("/api/analytics")
  return res.data
}
