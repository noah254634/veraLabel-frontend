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
      const { tasks } = get();
      const taskIndex = tasks.findIndex(t => t.id === id || (t as any)._id === id);
      if (taskIndex === -1) return;

      const triggerPrefetch = () => {
        const currentTasks = get().tasks;
        const index = currentTasks.findIndex(t => t.id === id || (t as any)._id === id);
        if (index === -1) return;

        const nextPendingTask = currentTasks.slice(index + 1).find(
          (t) => t.status !== 'submitted' && t.status !== 'flagged' && t.status !== 'verified'
        );
        if (nextPendingTask) {
          const nextId = nextPendingTask.id || (nextPendingTask as any)._id;
          const nextFetched = nextPendingTask.data?.url || (nextPendingTask as any).taskObject || (nextPendingTask as any).payloadFetched;
          if (nextId && !nextFetched) {
            get().fetchTaskPayload(nextId).catch((err) => {
              console.error("Background pre-fetching failed for task", nextId, err);
            });
          }
        }
      };

      // If we already have the payload (e.g. data or taskObject) or have fetched it, skip actual fetch but still prefetch next task
      if (
        tasks[taskIndex].data?.url || 
        (tasks[taskIndex] as any).taskObject || 
        (tasks[taskIndex] as any).payloadFetched
      ) {
        triggerPrefetch();
        return;
      }

      const response = await taskService.getTaskById(id);
      const payload = response?.taskObject ?? response?.task?.taskObject ?? response?.task?.data ?? null;

      const updatedTasks = [...get().tasks];
      const currentTaskIndex = updatedTasks.findIndex(t => t.id === id || (t as any)._id === id);
      if (currentTaskIndex !== -1) {
        updatedTasks[currentTaskIndex] = {
          ...updatedTasks[currentTaskIndex],
          ...payload, // Merge R2 payload (prompt, responses, etc)
          taskObject: payload ?? response?.taskObject ?? response?.task ?? null, // Keep raw object just in case
          payloadFetched: true
        };
        set({ tasks: updatedTasks });
      }

      // Trigger pre-fetching for the next pending task
      triggerPrefetch();
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

    // --- Optimistic local state update (instant, before any network call) ---
    const optimisticTasks = tasks.map((t) => {
      const id = t.id || (t as any)._id;
      return String(id) === String(taskId) ? { ...t, status: 'submitted' as any } : t;
    });
    const optimisticBatch = {
      ...activeBatch,
      completedTasks: (activeBatch?.completedTasks ?? 0) + 1,
    };
    set({ tasks: optimisticTasks, activeBatch: optimisticBatch });

    try {
      // 1. Generate presigned upload URL
      const responseUrl = await taskService.generateSubmissionUrl(taskId);
      const uploadUrl = responseUrl.data?.uploadUrl || responseUrl.uploadUrl;

      if (!uploadUrl) {
        throw new Error("Failed to generate secure upload gateway.");
      }

      // Detect if it is a crowdsourced collection task
      const isCollection = annotation && typeof annotation === 'object' && annotation.blob instanceof Blob;

      // 2. Direct upload annotation/audio to R2
      let bodyPayload: any;
      let uploadContentType: string;
      let submissionMetadata: any = null;

      if (isCollection) {
        bodyPayload = annotation.blob;
        uploadContentType = 'audio/wav';
        submissionMetadata = annotation.metadata;
      } else {
        const isBlob = annotation instanceof Blob;
        uploadContentType = isBlob ? 'audio/wav' : 'application/json';
        bodyPayload = isBlob ? annotation : JSON.stringify(annotation || {});
      }

      await axios.put(uploadUrl, bodyPayload, {
        headers: { 'Content-Type': uploadContentType },
      });

      // 3. Finalize task on backend — retry up to 2 extra times if network/server fails.
      let response: any = null;
      let lastError: any = null;
      for (let attempt = 0; attempt <= 2; attempt++) {
        try {
          response = await taskService.submitTask(taskId, batchId, submissionMetadata);
          lastError = null;
          break;
        } catch (finalizeErr: any) {
          lastError = finalizeErr;
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 500 * (attempt + 1) * (attempt + 1)));
          }
        }
      }

      if (lastError) {
        throw new Error(
          `Annotation uploaded, but sync confirmation failed: ${lastError?.response?.data?.message ?? lastError?.message}. Please contact support with Task ID: ${taskId}.`
        );
      }

      // Reconcile with server-returned progress counters if available
      const progress = response?.progress ?? response?.data?.progress;
      if (progress?.completed != null) {
        set((s) => ({
          activeBatch: { ...s.activeBatch, completedTasks: progress.completed },
        }));
      }

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
