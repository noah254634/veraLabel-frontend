import { api } from "../../../shared/types/api";

export const dashboardService = {
  initiatePayment: async (requestId: string, amount: string): Promise<{ url: string }> => {
    const response = await api.post("/payments/create", {
      requestId,
      amount,
    });
    return response.data;
  },

  cancelPayment: async (orderId: string): Promise<any> => {
    const response = await api.put(`/marketplace/cancelPayment/${orderId}`);
    return response.data;
  },

  reportIssue: async (orderId: string, reason: string): Promise<any> => {
    const response = await api.post(`/marketplace/reportIssue/${orderId}`, {
      reason,
    });
    return response.data;
  },
};
