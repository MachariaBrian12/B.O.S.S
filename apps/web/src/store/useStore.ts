import { create } from 'zustand';
import { api } from '../lib/api';

interface StoreState {
  status: unknown;
  insights: unknown;
  loading: boolean;
  loadAll: () => Promise<void>;
}

export const useStore = create<StoreState>((set) => ({
  status: null,
  insights: null,
  loading: false,

  loadAll: async () => {
    set({ loading: true });
    try {
      const [status, insights] = await Promise.all([
        api.me(),
        api.getInsights(),
      ]);
      set({ status, insights, loading: false });
    } catch (error) {
      console.error('[useStore] error:', error);
      set({ loading: false });
    }
  },
}));
