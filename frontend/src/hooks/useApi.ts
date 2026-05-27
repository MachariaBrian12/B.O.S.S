import { api } from "../lib/api";

export async function getStatus(token: string) {
  return api.me(token);
}

export async function getInsightsData(token: string) {
  return api.getInsights(token);
}

export async function getHistory(token: string, limit = 30) {
  return api.getHistory(token, limit);
}

export async function getWeek(token: string) {
  return api.getWeek(token);
}
