import { api } from "../../../shared/types/api";
import type { TaskSession, SystemStats } from "../types/taskProgressTypes";

export interface TaskProgressResponse {
  success: boolean;
  data: TaskSession[];
  stats: SystemStats;
  count: number;
}

export interface TaskStatsResponse {
  success: boolean;
  data: SystemStats;
}

export const taskProgressService = {
  /**
   * Fetch all active task processing sessions
   */
  getAllSessions: async (): Promise<{ sessions: TaskSession[]; stats: SystemStats }> => {
    const response = await api.get<TaskProgressResponse>("/tasks/progress/admin/sessions");
    return {
      sessions: response.data.data,
      stats: response.data.stats,
    };
  },

  /**
   * Get system-wide progress statistics
   */
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await api.get<TaskStatsResponse>("/tasks/progress/admin/stats");
    return response.data.data;
  },

  /**
   * Get EventSource for streaming a specific task session
   */
  subscribeToSessionStream: (projectId: string, datasetId: string): EventSource => {
    return new EventSource(`/api/v1/tasks/progress/${projectId}/${datasetId}/stream`);
  },
};
