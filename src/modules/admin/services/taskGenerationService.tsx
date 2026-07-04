import { api } from "../../../shared/types/api";

export interface TaskGenerationParams {
  category: string;
  regionTags: string[];
  speechLengthTarget?: number;
  codeSwitchExpected?: boolean;
  customInstructions?: string;
  count?: number;
}

export interface TaskGenerationRun {
  _id: string;
  runId: string;
  category: string;
  regionTags: string[];
  seedParams: {
    speechLengthTarget?: number;
    codeSwitchExpected: boolean;
    customInstructions?: string;
  };
  countRequested: number;
  status: "generating" | "review_required" | "completed" | "failed";
  createdAt: string;
}

export interface DraftTask {
  _id: string;
  taskId: string;
  taskName: string;
  instructionText: string;
  status: string;
  runId: string;
  category: string;
}

export const taskGenerationService = {
  generateTasks: async (params: TaskGenerationParams): Promise<{ runId: string; status: string; count: number }> => {
    const response = await api.post("/admin/tasks/generate", params);
    return response.data.data;
  },

  getRuns: async (): Promise<TaskGenerationRun[]> => {
    const response = await api.get("/admin/tasks/runs");
    return response.data.data?.runs ?? [];
  },

  getTasksForRun: async (runId: string): Promise<DraftTask[]> => {
    const response = await api.get(`/admin/tasks/runs/${runId}/tasks`);
    return response.data.data?.tasks ?? [];
  },

  updateTaskText: async (taskId: string, instructionText: string): Promise<DraftTask> => {
    const response = await api.put(`/admin/tasks/tasks/${taskId}`, { instructionText });
    return response.data.data?.task;
  },

  approveRunAndBatch: async (
    runId: string, 
    params: { datasetId?: string; datasetName?: string; datasetDescription?: string }
  ): Promise<{ success: boolean; modifiedCount: number }> => {
    const response = await api.post(`/admin/tasks/runs/${runId}/approve`, params);
    return response.data.data;
  }
};
