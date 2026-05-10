import { create } from "zustand";
import { toast } from "react-hot-toast";
import { dashboardService } from "../service/dashboardService";

type DashboardStore = {
  loadingOrderIds: Record<string, boolean>;
  initiatePayment: (requestId: string, amount: string) => Promise<{ url: string }>;
  cancelPayment: (orderId: string) => Promise<void>;
  reportIssue: (orderId: string, reason: string) => Promise<void>;
  setLoadingOrderId: (orderId: string, loading: boolean) => void;
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  loadingOrderIds: {},

  setLoadingOrderId: (orderId: string, loading: boolean) =>
    set((state) => ({
      loadingOrderIds: {
        ...state.loadingOrderIds,
        [orderId]: loading,
      },
    })),

  initiatePayment: async (requestId: string, amount: string) => {
    set((state) => ({
      loadingOrderIds: { ...state.loadingOrderIds, [requestId]: true },
    }));
    try {
      const response = await dashboardService.initiatePayment(requestId, amount);
      return response;
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Payment initialization failed";
      toast.error(msg);
      throw error;
    } finally {
      set((state) => {
        const newState = { ...state.loadingOrderIds };
        delete newState[requestId];
        return { loadingOrderIds: newState };
      });
    }
  },

  cancelPayment: async (orderId: string) => {
    try {
      await dashboardService.cancelPayment(orderId);
      toast.success("Order cancelled successfully");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to cancel";
      toast.error(msg);
      throw error;
    }
  },

  reportIssue: async (orderId: string, reason: string) => {
    if (!reason.trim()) {
      toast.error("Please provide a reason");
      throw new Error("Reason is required");
    }
    try {
      await dashboardService.reportIssue(orderId, reason);
      toast.success("Issue reported successfully");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Failed to report";
      toast.error(msg);
      throw error;
    }
  },
}));
