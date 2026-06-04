import { create } from "zustand";
import { taskProgressService } from "../services/taskProgressService";
import type { TaskProgressState } from "../types/taskProgressTypes";

export const taskProgressStore = create<TaskProgressState>((set) => ({
  sessions: [],
  stats: null,
  loading: true,
  error: null,
  selectedSession: null,

  /**
   * Fetch all active sessions and system stats
   */
  fetchSessions: async () => {
    try {
      set({ loading: true, error: null });
      const { sessions, stats } = await taskProgressService.getAllSessions();
      set({ sessions, stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch task sessions";
      set({ error: message });
      console.error("Error fetching task sessions:", err);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Set the currently selected session for streaming
   */
  setSelectedSession: (sessionId: string | null) => {
    set({ selectedSession: sessionId });
  },

  /**
   * Set error state
   */
  setError: (error: string | null) => {
    set({ error });
  },

  /**
   * Refresh all data
   */
  refreshData: async () => {
    try {
      const { sessions, stats } = await taskProgressService.getAllSessions();
      set({ sessions, stats });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh task data";
      set({ error: message });
      console.error("Error refreshing task data:", err);
    }
  },
}));
