import type { Dataset } from "../../../shared/types/dataset";
import { api } from "../../../shared/types/api";
export const datasetService = {
  fetchDatasetById: async (id: string): Promise<Dataset | null> => {
      const response = await api.get(`/datasets/${id}`);
           return response.data;   
  },
  fetchDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets/allDatasets");
    if (response.status !==200) {
      throw new Error("Failed to fetch datasets");
    }
    return response.data;

  },
  getDataset: async (): Promise<Dataset[] | null> => {
    return null;
  },
  deleteDataset: async (id: string,reason:string): Promise<any> => {
    const response = await api.delete(`/datasets/deleteDataset/${id}`,{data:{reason:reason}});
    return response.data;
  },
  addDataset: async (): Promise<void> => {},
  publishDataset: async (): Promise<void> => {
    const response = await api.post("admin/datasets/publish");
    return response.data;
  },
  unpublishDataset: async (id:string,reason:string): Promise<void> => {
    const response = await api.post(`admin/datasets/unpublish/${id}`,{reason:reason});
    return response.data;
  },
  getDatasetById: async (id:string): Promise<Dataset | null> => {
    const response=await api.get(`admindatasets/getById/${id}`);
    return response.data;
  },
  publishDatasetById: async (id: string): Promise<any> => {
    const response = await api.post(`admin/datasets/publish/${id}`);
    return response.data;
  },
  unpublishDatasetById: async (id: string, reason: string): Promise<any> => {
    const response=await api.post(`admin/datasets/unpublish/${id}`, { reason });
    return response.data 
  },
  rateDataset: async (rate: number,id:string): Promise<any> => {
    const response = await api.post(`admin/datasets/rateDataset/${id}`, { rate });
    return response.data;
  },
  approveDatasetById: async (id: string): Promise<any> => {
    const response = await api.post(`admin/datasets/${id}/approve`);
    return response.data;
  },
  rejectDataset: async (id:string,reason:string): Promise<any> => {
    const response=await api.post(`admin/datasets/${id}/reject`,{reason:reason})
    return response.data;
  },
  getDatasetByCategory: async (category:string): Promise<Dataset[] | null> => {
    const response=await api.get(`admin/datasets/category/${category}`);
    return response.data;
  },
  getDatasetByUser: async (email:string): Promise<Dataset[] | null> => {
    const response=await api.get(`admin/user/${email}`);
    return response.data;
  },
};
