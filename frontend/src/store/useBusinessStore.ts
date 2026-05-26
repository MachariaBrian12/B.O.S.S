import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  business: string;
}

interface TodayEntry {
  sales: number;
  expenses: number;
  profit: number;
  margin: number;
  date: string;
}

interface WeekStats {
  totalSales: number;
  totalExpenses: number;
  totalProfit: number;
  avgDailySales: number;
  bestDaySales: number;
  daysRecorded: number;
}

interface Insights {
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
}

interface BusinessStore {
  user:     User | null;
  token:    string | null;
  insights: Insights | null;
  loading:  boolean;
  error:    string | null;

  setUser:     (user: User, token: string) => void;
  setInsights: (insights: Insights) => void;
  setLoading:  (loading: boolean) => void;
  setError:    (error: string | null) => void;
  logout:      () => void;
}

export const useBusinessStore = create<BusinessStore>()(
  persist(
    (set) => ({
      user:     null,
      token:    null,
      insights: null,
      loading:  false,
      error:    null,

      setUser:     (user, token) => set({ user, token, error: null }),
      setInsights: (insights)   => set({ insights }),
      setLoading:  (loading)    => set({ loading }),
      setError:    (error)      => set({ error }),
      logout:      ()           => set({ user: null, token: null, insights: null }),
    }),
    {
      name: "boss-store",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
