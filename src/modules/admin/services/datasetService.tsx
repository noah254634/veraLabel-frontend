import type { Dataset } from "../../../shared/types/dataset";
import { api } from "../../../shared/types/api";
export const datasetService = {
  fetchDatasetById: async (id: string): Promise<Dataset | null> => {
    const response = await api.get(`/datasets/${id}`);
    return response.data.data?.dataset ?? null;
  },
  fetchDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets/allDatasets");
    return response.data.data?.datasets ?? [];
  },
  fetchPendingDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/admin/datasets/pending");
    return response.data.data?.datasets ?? [];
  },
  fetchApprovedDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/admin/datasets/approved");
    return response.data.data?.datasets ?? [];
  },
  fetchRejectedDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/admin/datasets/rejected");
    return response.data.data?.datasets ?? [];
  },
  fetchFlaggedDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/admin/datasets/flagged");
    return response.data.data?.datasets ?? [];
  },
  getDataset: async (): Promise<Dataset[] | null> => {
    return null;
  },
  deleteDataset: async (id: string,reason:string): Promise<any> => {
    const response = await api.delete(`/datasets/deleteDataset/${id}`,{data:{reason:reason}});
    return response.data.data;
  },
  addDataset: async (): Promise<void> => {},
  publishDataset: async (): Promise<void> => {
    const response = await api.post("admin/datasets/publish");
    return response.data.data;
  },
  unpublishDataset: async (id:string,reason:string): Promise<void> => {
    const response = await api.post(`admin/datasets/unpublish/${id}`,{reason:reason});
    return response.data.data;
  },
  getDatasetById: async (id:string): Promise<Dataset | null> => {
    const response = await api.get(`admindatasets/getById/${id}`);
    return response.data.data?.dataset ?? null;
  },
  publishDatasetById: async (id: string): Promise<any> => {
    const response = await api.post(`admin/datasets/publish/${id}`);
    return response.data.data;
  },
  unpublishDatasetById: async (id: string, reason: string): Promise<any> => {
    const response = await api.post(`admin/datasets/unpublish/${id}`, { reason });
    return response.data.data;
  },
  rateDataset: async (rate: number,id:string): Promise<any> => {
    const response = await api.post(`admin/datasets/rateDataset/${id}`, { rate });
    return response.data.data;
  },
  approveDatasetById: async (id: string): Promise<any> => {
    const response = await api.post(`datasets/${id}/approve`);
    return response.data.data;
  },
  rejectDataset: async (id:string,reason:string): Promise<any> => {
    const response = await api.post(`admin/datasets/${id}/reject`,{reason:reason});
    return response.data.data;
  },
  getDatasetByCategory: async (category:string): Promise<Dataset[] | null> => {
    const response = await api.get(`admin/datasets/category/${category}`);
    return response.data.data?.datasets ?? [];
  },
  getDatasetByUser: async (email:string): Promise<Dataset[] | null> => {
    const response = await api.get(`admin/user/${email}`);
    return response.data.data?.datasets ?? [];
  },
  updateDatasetPrice: async (id: string, price: number): Promise<any> => {
    const response = await api.put(`admin/setDatasetprice/${id}`, { price });
    return response.data.data;
  },
  updateDatasetStatus: async (id: string, status: string): Promise<any> => {
    const response = await api.put(`admin/datasets/${id}/status`, { status });
    return response.data.data;
  },
  updateDatasetBatchPrice: async (id: string, pricePerBatch: number): Promise<any> => {
    const response = await api.put(`admin/datasets/${id}/batch-price`, { pricePerBatch });
    return response.data.data;
  },
  updateDatasetPriority: async (id: string, priority: string): Promise<any> => {
    const response = await api.put(`admin/datasets/${id}/priority`, { priority });
    return response.data.data;
  },
  updateDatasetMaxLabellers: async (id: string, maxLabellers: number): Promise<any> => {
    const response = await api.put(`admin/datasets/${id}/max-labellers`, { maxLabellers });
    return response.data.data;
  },
  // Revoke all in-progress/available batches for a specific dataset and renew them
  revokeDatasetBatches: async (datasetId: string): Promise<{
    datasetId: string;
    revoked: number;
    tasksReset: number;
    renewedUntil: string;
  }> => {
    const response = await api.post(`/tasks/revoke-dataset-batches`, { datasetId });
    return response.data.data;
  },
  compileDataset: async (id: string): Promise<any> => {
    const response = await api.post(`admin/datasets/${id}/compile`);
    return response.data.data || response.data;
  },
  evaluateConsensus: async (id: string): Promise<any> => {
    const response = await api.post(`admin/datasets/${id}/evaluate-consensus`);
    return response.data.data || response.data;
  },
  // Global sweep: revoke all expired batches across the platform
  revokeAllExpiredBatches: async (): Promise<{ revoked: number; tasksReset: number }> => {
    const response = await api.post(`/tasks/revoke-expired-batches`, {});
    return response.data.data;
  },
};
