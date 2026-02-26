import { api } from "../../../shared/types/api"

export type AnalyticsOverview = {
  users: {
    total: number
    newToday: number
    newThisMonth: number
  }
  datasets: {
    total: number
    pending: number
    approved: number
    rejected: number
  }
  revenue: {
    thisMonth: number
    netWorth: number
    
  }
}

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsOverview> => {
    const response = await api.get("/analytics/platformOverview")
    return response.data
  },
}
