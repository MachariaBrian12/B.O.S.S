import { create } from "zustand"

import {
  getStatus,
  getInventory,
  getInsights,
  getAnalytics,
} from "../hooks/useApi"

interface StoreState {
  status: any
  inventory: any
  insights: any[]
  analytics: any
  loading: boolean
  loadAll: () => Promise<void>
}

export const useStore = create<StoreState>((set) => ({
  status: null,
  inventory: null,
  insights: [],
  analytics: null,
  loading: false,

  loadAll: async () => {
    set({ loading: true })

    try {
      const [status, inventory, insights, analytics] =
        await Promise.all([
          getStatus(),
          getInventory(),
          getInsights(),
          getAnalytics(),
        ])

      set({
        status,
        inventory,
        insights: insights.insights,
        analytics,
        loading: false,
      })
    } catch (error) {
      console.error(error)

      set({
        loading: false,
      })
    }
  },
}))
