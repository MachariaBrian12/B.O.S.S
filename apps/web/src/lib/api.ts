import { apiClient } from './apiClient';

export const api = {
  login: (email: string, password: string) =>
    apiClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string, business: string) =>
    apiClient('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, business }),
    }),

  me: () => apiClient('/auth/me'),

  getInsights: () => apiClient('/insights/daily'),

  getWeek: () => apiClient('/business/week'),

  getSignals: () => apiClient('/insights/signals'),

  getToday: () => apiClient('/business/today'),

  getHistory: (limit: number) => apiClient(`/business/history?limit=${limit}`),

  addEntry: (data: any) =>
    apiClient('/business/entry', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateEntry: (data: any) =>
    apiClient('/business/entry', { method: 'PUT', body: JSON.stringify(data) }),

  deleteEntry: () => apiClient('/business/entry', { method: 'DELETE' }),

  updateProfile: (data: any) =>
    apiClient('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  logout: () => apiClient('/auth/logout', { method: 'POST' }),
};
