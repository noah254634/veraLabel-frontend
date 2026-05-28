import { create } from 'zustand';
import { analyticsService } from '../services/analyticsService';
import { toast } from 'react-hot-toast';
import type { AnalyticsOverview, LabellerAnalyticsState } from '../types/analyticsTypes';

interface AnalyticsState {
  // Legacy Dashboard State
  overview: AnalyticsOverview | null;
  
  // New Revenue State
  revenueData: any | null;
  
  // Dataset State
  datasetData: any | null;
  
  loading: boolean;
  error: string | null;
  
  // Legacy Methods
  getAnalytics: () => Promise<AnalyticsOverview | void>;
  
  // New Methods
  fetchRevenueAnalytics: () => Promise<void>;
  fetchDatasetAnalytics: () => Promise<void>;
  
  // Utility
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearRevenueData: () => void;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  overview: null,
  revenueData: null,
  datasetData: null,
  loading: false,
  error: null,

  getAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const data = await analyticsService.getAnalytics();
      set({ overview: data });
      return data;
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to fetch platform overview";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchRevenueAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const data = await analyticsService.getRevenueAnalytics();
      set({ revenueData: data });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to sync revenue analytics";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  fetchDatasetAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const data = await analyticsService.getDatasetAnalytics();
      set({ datasetData: data });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to sync dataset analytics";
      set({ error: message });
      toast.error(message);
    } finally {
      set({ loading: false });
    }
  },

  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  clearRevenueData: () => set({ revenueData: null, error: null }),
}));

// Export as analyticsStore to fix Dashboard.tsx legacy imports
export const analyticsStore = useAnalyticsStore;

export const labellerAnalyticsStore = create<LabellerAnalyticsState>((set) => ({
  labellerOverview: null,
  labellerPerformance: null,
  labellerTiers: null,
  labellerEarnings: null,
  labellerActivity: null,
  labellerTaskCompletion: null,
  labellerRatings: null,
  loading: false,
  error: null,

  fetchLabellerAnalytics: async () => {
    try {
      set({ loading: true, error: null });
      const [
        overview,
        performance,
        tiers,
        earnings,
        activity,
        taskCompletion,
        ratings
      ] = await Promise.all([
        analyticsService.getLabellerStats(),
        analyticsService.getLabellerPerformance(),
        analyticsService.getLabellerTiers(),
        analyticsService.getLabellerEarnings(),
        analyticsService.getLabellerActivity(),
        analyticsService.getLabellerTaskCompletion(),
        analyticsService.getLabellerRatings(),
      ]);

      set({
        labellerOverview: overview,
        labellerPerformance: performance,
        labellerTiers: tiers,
        labellerEarnings: earnings,
        labellerActivity: activity,
        labellerTaskCompletion: taskCompletion,
        labellerRatings: ratings,
        loading: false
      });
    } catch (error: any) {
      const message = error.response?.data?.error || "Failed to fetch labeller analytics";
      set({ error: message, loading: false });
      toast.error(message);
    }
  },

  setError: (error: string | null) => set({ error }),
}));
