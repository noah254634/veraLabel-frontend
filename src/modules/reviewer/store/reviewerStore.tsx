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
  requestWithdrawalOTP: (amount: number) => Promise<boolean>;
  requestPayout: (amount: number, phoneNumber: string, otp: string) => Promise<void>;
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

  requestWithdrawalOTP: async (amount: number) => {
    try {
      set({ loading: true });
      await api.post('/payments/withdraw/otp', { amount });
      toast.success("OTP sent to your email.");
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  requestPayout: async (amount: number, phoneNumber: string, otp: string) => {
    try {
      set({ loading: true });
      await api.post('/payments/withdraw', { amount, phoneNumber, otp });
      toast.success("Withdrawal request completed successfully.");
      await get().fetchStats();
    } catch (error: any) {
      console.error("Payout request failed:", error);
      toast.error(error.response?.data?.message || "Withdrawal request failed.");
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
