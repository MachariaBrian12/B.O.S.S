import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as Sentry from '@sentry/nextjs';

export interface User {
  id: number;
  name: string;
  email: string;
  business: string;
}

export interface TodayEntry {
  sales: number;
  expenses: number;
  profit: number;
  margin: number;
  date: string;
}

export interface WeekStats {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  avgDailySales: number;
  bestDaySales: number;
  daysRecorded: number;
}

export interface FeedItem {
  id: string;
  type: string;
  icon: string;
  title: string;
  body: string;
  time: string;
  priority: number;
}

export interface Signal {
  id: string;
  confidence: number;
  direction: string;
  title: string;
  body: string;
  timeframe: string;
}

export interface Alert {
  level: string;
  title: string;
  body: string;
  action: string;
}

export interface Insights {
  hasData: boolean;
  today: TodayEntry | null;
  yesterday: TodayEntry | null;
  profitTrend: string;
  topProduct: string;
  summary: string;
  warning: string | null;
  recommendation: string;
  score: number;
  weekStats: WeekStats | null;
  history: { date: string; sales: number; expenses: number; profit: number }[];
  feed: FeedItem[];
  signals: Signal[];
  alerts: Alert[];
  streak: number;
}

interface BusinessStore {
  user: User | null;
  insights: Insights | null;
  loading: boolean;
  error: string | null;

  setUser: (user: User) => void;
  setInsights: (insights: Insights) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set) => ({
      user: null,
      insights: null,
      loading: false,
      error: null,

      setUser: (user) => {
        // Tell Sentry exactly who is logged in
        Sentry.setUser({
          id: String(user.id),
          email: user.email,
          username: user.name,
          business: user.business,
        });
        set({ user, error: null });
      },

      setInsights: (insights) => set({ insights }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => {
        // Clear Sentry user so errors after logout aren't misattributed
        Sentry.setUser(null);
        set({ user: null, insights: null });
      },
    }),
    {
      // Only persist the user object for display — never the token.
      // Auth is handled by the httpOnly cookie set by the API,
      // which is invisible to JavaScript and safe from XSS.
      name: 'boss-store',
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
