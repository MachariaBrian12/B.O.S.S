import { api } from '../lib/api';

export async function getStatus() {
  return api.me();
}

export async function getInsightsData() {
  return api.getInsights();
}

export async function getHistory(limit = 30) {
  return api.getHistory(limit);
}

export async function getWeek() {
  return api.getWeek();
}
