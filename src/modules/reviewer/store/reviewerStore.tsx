import { create } from "zustand";
import { api } from "../../../shared/types/api";
import toast from "react-hot-toast";

export interface ReviewerEarnings {
  total: number;
  pending: number;
  paid: number;
}

export interface ReviewerStats {
  totalReviewed: number;
  averageScore: number;
  pendingReviews: number;
  approved: number;
  rejected: number;
  approvalRate: string;
  earnings?: ReviewerEarnings;
}

interface ReviewerState {
  stats: ReviewerStats | null;
  loading: boolean;
  fetchStats: () => Promise<void>;
  requestPayout: (amount: number, method: string) => Promise<void>;
}

export const useReviewerStore = create<ReviewerState>((set, get) => ({
  stats: null,
  loading: false,

  fetchStats: async () => {
    try {
      set({ loading: true });
      const response = await api.get("/reviewer/stats");
      const data = response.data?.data || response.data;
      set({ stats: data });
    } catch (error) {
      console.error("Failed to sync reviewer stats:", error);
      toast.error("Failed to sync reviewer stats.");
    } finally {
      set({ loading: false });
    }
  },

  requestPayout: async (amount: number, method: string) => {
    try {
      set({ loading: true });
      await api.post("/reviewer/request-payout", { amount, method });
      toast.success("Reviewer withdrawal request completed.");
      await get().fetchStats();
    } catch (error: any) {
      console.error("Payout request failed:", error);
      toast.error(error.response?.data?.message || "Withdrawal request failed.");
    } finally {
      set({ loading: false });
    }
  },
}));
