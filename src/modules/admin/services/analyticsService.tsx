import { api } from "../../../shared/types/api"
import type { AnalyticsOverview, LabellerStats, LabellerEarnings, LabellerActivity, TaskCompletion, LabellerRatings, LabellerPerformance, LabellerTiers, TasksQueueHealth, TasksVelocity, TasksDistribution, TasksQualityMetrics, TopDatasets } from "../types/analyticsTypes"

export const analyticsService = {
  getAnalytics: async (): Promise<AnalyticsOverview> => {
    const response = await api.get("/analytics/platformOverview")
    return response.data
  },

  getLabellerStats: async (): Promise<LabellerStats> => {
    const response = await api.get("/analytics/labellers/overview")
    return response.data
  },

  getLabellerPerformance: async (): Promise<LabellerPerformance> => {
    const response = await api.get("/analytics/labellers/performance")
    return response.data
  },

  getLabellerTiers: async (): Promise<LabellerTiers> => {
    const response = await api.get("/analytics/labellers/tiers")
    return response.data
  },

  getLabellerEarnings: async (): Promise<LabellerEarnings> => {
    const response = await api.get("/analytics/labellers/earnings")
    return response.data
  },

  getLabellerActivity: async (): Promise<LabellerActivity> => {
    const response = await api.get("/analytics/labellers/activity")
    return response.data
  },

  getLabellerTaskCompletion: async (): Promise<TaskCompletion> => {
    const response = await api.get("/analytics/labellers/task-completion")
    return response.data
  },

  getLabellerRatings: async (): Promise<LabellerRatings> => {
    const response = await api.get("/analytics/labellers/ratings")
    return response.data
  },

  getTasksQueueHealth: async (): Promise<TasksQueueHealth> => {
    const response = await api.get("/analytics/tasks/queue-health")
    return response.data
  },

  getTasksVelocity: async (): Promise<TasksVelocity> => {
    const response = await api.get("/analytics/tasks/velocity")
    return response.data
  },

  getTasksDistribution: async (): Promise<TasksDistribution> => {
    const response = await api.get("/analytics/tasks/distribution")
    return response.data
  },

  getTasksQualityMetrics: async (): Promise<TasksQualityMetrics> => {
    const response = await api.get("/analytics/tasks/quality-metrics")
    return response.data
  },

  getTopDatasets: async (): Promise<TopDatasets[]> => {
    const response = await api.get("/analytics/tasks/top-datasets")
    return response.data
  },
}
