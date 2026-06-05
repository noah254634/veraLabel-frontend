import type { Task } from "../types/task"
import { taskService } from "../services/taskService"
import toast from "react-hot-toast";
import { create } from "zustand";
import { api } from "../../../shared/types/api";
import axios from "axios";

type TaskStore = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  getTasks: () => Promise<Task[]>;
  getMyActiveBatch: () => Promise<void>;
  deleteTask: (id: string, reason: string) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
  fetchTaskPayload: (id: string) => Promise<void>;
  claimBatch: (datasetId: string) => Promise<void>;
  submitTask: (taskId: string, annotation?: any) => Promise<void>;
  flagTask: (taskId: string, reason: string, detail: string) => Promise<void>;
  activeBatch: any;
};
export const useTaskStore = create<TaskStore>((set, get) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: null,
  setError: (error) => set({ error }),
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  getTasks: async () =>{
    try {
        set({loading:true})
        set({error:null})
        const response = await taskService.getTasks() as unknown as Task[];
        const tasks = response;
        set({loading:false, tasks: tasks})
        return tasks
    } catch (err) {
        set({loading:false})
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        toast.error(errorMessage);
        return []
    }
  },
  activeBatch: null,
  getMyActiveBatch: async () => {
    try {
      set({ loading: true });
      const response = await api.get('/tasks/my-active-batch');
      const batch = response.data && 'data' in response.data ? response.data.data : response.data;
      if (batch) {
        set({ tasks: batch.tasks || [], activeBatch: batch });
      } else {
        set({ tasks: [], activeBatch: null });
      }
    } catch {
      set({ tasks: [], activeBatch: null });
    } finally {
      set({ loading: false });
    }
  },
  deleteTask: async (id, reason) => {
    try {
      set({ loading: true, error: null });
      await taskService.deleteTask(id, reason);
      set({ loading: false });
    } catch (err) {
      set({ loading: false });
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    }
  },
  clearError: () => set({ error: null }),
  resetStore: () => set({ loading: false, error: null, tasks: [] }),
  fetchTaskPayload: async (id) => {
    try {
      // Don't set global loading as it might flicker the whole UI
      const { tasks } = get();
      const taskIndex = tasks.findIndex(t => t.id === id || (t as any)._id === id);
      if (taskIndex === -1) return;

      // If we already have the payload (e.g. data or taskObject) or have fetched it, skip
      if (
        tasks[taskIndex].data?.url || 
        (tasks[taskIndex] as any).taskObject || 
        (tasks[taskIndex] as any).payloadFetched
      ) return;

      const response = await taskService.getTaskById(id);
      const payload = response?.taskObject ?? response?.task?.taskObject ?? response?.task?.data ?? null;

      const updatedTasks = [...tasks];
      updatedTasks[taskIndex] = {
        ...updatedTasks[taskIndex],
        ...payload, // Merge R2 payload (prompt, responses, etc)
        taskObject: payload ?? response?.taskObject ?? response?.task ?? null, // Keep raw object just in case
        payloadFetched: true
      };

      set({ tasks: updatedTasks });
    } catch (err) {
      console.error("Failed to fetch task payload", err);
      // Mark as fetched even on error to prevent infinite API call loops
      const { tasks } = get();
      const taskIndex = tasks.findIndex(t => t.id === id || (t as any)._id === id);
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          payloadFetched: true
        };
        set({ tasks: updatedTasks });
      }
    }
  },
  claimBatch: async (datasetId) => {
    try {
      set({ loading: true, error: null });
      const response = await api.post('/tasks/claim-batch', { datasetId });
      const batch = response.data && 'data' in response.data ? response.data.data : response.data;
      
      if (batch && Array.isArray(batch.tasks)) {
        // Map the populated tasks from the batch into the store
        set({ tasks: batch.tasks, activeBatch: batch, loading: false });
      } else {
        throw new Error("Invalid batch format received");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      set({ loading: false, error: msg });
      throw new Error(msg);
    }
  },
  submitTask: async (taskId, annotation) => {
    const { activeBatch, tasks } = get();
    const batchId = activeBatch?._id || activeBatch?.id;

    if (!batchId) {
      toast.error("No active batch context found.");
      return;
    }

    try {
      // 1. Generate presigned upload URL
      const responseUrl = await taskService.generateSubmissionUrl(taskId);
      const uploadUrl = responseUrl.data?.uploadUrl || responseUrl.uploadUrl;

      if (!uploadUrl) {
        throw new Error("Failed to generate secure upload gateway.");
      }

      // 2. Direct upload annotation to R2 (bypasses backend for efficiency)
      await axios.put(uploadUrl, annotation || {}, {
        headers: { 'Content-Type': 'application/json' },
      });

      // 3. Finalize task on backend — retry up to 2 extra times if network/server fails.
      //    The annotation is already safely in R2, so retrying is safe.
      let response: any = null;
      let lastError: any = null;
      for (let attempt = 0; attempt <= 2; attempt++) {
        try {
          response = await taskService.submitTask(taskId, batchId);
          lastError = null;
          break; // success — exit retry loop
        } catch (finalizeErr: any) {
          lastError = finalizeErr;
          if (attempt < 2) {
            // Exponential backoff: 500ms, 1500ms
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1) * (attempt + 1)));
          }
        }
      }

      if (lastError) {
        // All retries exhausted — surface a clear message, task will still be pending
        // but annotation is safe in R2 and can be recovered.
        throw new Error(
          `Annotation uploaded, but sync confirmation failed: ${lastError?.response?.data?.message ?? lastError?.message}. Please contact support with Task ID: ${taskId}.`
        );
      }

      // Update local task status optimistically
      const updatedTasks = tasks.map((t) => {
        const id = t.id || (t as any)._id;
        return String(id) === String(taskId) ? { ...t, status: 'submitted' as any } : t;
      });

      // Update active batch progress counters if returned
      const updatedBatch = { ...activeBatch };
      const progress = response?.progress ?? response?.data?.progress;
      if (progress?.completed != null) {
        updatedBatch.completedTasks = progress.completed;
      } else {
        // Increment locally if backend didn't return updated count
        updatedBatch.completedTasks = (updatedBatch.completedTasks ?? 0) + 1;
      }

      set({ tasks: updatedTasks, activeBatch: updatedBatch });
      toast.success("Asset synchronization successful");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      throw err;
    }
  },
  flagTask: async (taskId, reason, detail) => {
    const { activeBatch, tasks } = get();
    const batchId = activeBatch?._id || activeBatch?.id;

    if (!batchId) {
      toast.error("No active batch context found.");
      return;
    }

    try {
      const response = await api.put(`/tasks/submit/${taskId}`, {
        batchId,
        isFlagged: true,
        flagReason: reason,
        flagDetail: detail
      });

      // Update local task status optimistically
      const updatedTasks = tasks.map((t) => {
        const id = t.id || (t as any)._id;
        return String(id) === String(taskId) ? { ...t, status: 'flagged' as any } : t;
      });

      // Update active batch progress counters if returned
      const updatedBatch = { ...activeBatch };
      const progress = response.data?.progress ?? response.data?.data?.progress;
      if (progress?.completed != null) {
        updatedBatch.completedTasks = progress.completed;
      } else {
        // Increment locally if backend didn't return updated count
        updatedBatch.completedTasks = (updatedBatch.completedTasks ?? 0) + 1;
      }

      set({ tasks: updatedTasks, activeBatch: updatedBatch });
      toast.success("Task flagged successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
      throw err;
    }
  }
}));
