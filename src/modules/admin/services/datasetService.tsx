import type { Dataset } from "../../../shared/types/dataset";
import { api } from "../../../shared/types/api";
export const datasetService = {
  fetchDatasetById: async (id: string): Promise<Dataset | null> => {
      const response = await api.get(`/datasets/${id}`);
           return response.data;   
  },
  fetchDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets");
    if (response.status !==200) {
      throw new Error("Failed to fetch datasets");
    }
    return response.data;

  },
  getDataset: async (): Promise<Dataset[] | null> => {
    return null;
  },
  deleteDataset: async (id: string,reason:string): Promise<void> => {
    const response = await api.delete(`/datasets/delete/${id}`,{data:{reason:reason}});
    return response.data;
  },
  addDataset: async (): Promise<void> => {},
  publishDataset: async (): Promise<void> => {
    const response = await api.post("/publish");
    return response.data;
  },
  unpublishDataset: async (id:string,reason:string): Promise<void> => {
    const response = await api.post(`datasets/unpublish/${id}`,{reason:reason});
    return response.data;
  },
  getDatasetById: async (id:string): Promise<Dataset | null> => {
    const response=await api.get(`/datasets/getById/${id}`);
    return response.data;
  },
  publishDatasetById: async (id: string): Promise<void> => {
    const response = await api.post(`/publish/${id}`);
    return response.data;
  },
  unpublishDatasetById: async (id: string, reason: string): Promise<void> => {
    const response=await api.post(`/unpublish/${id}`);
    return response.data 
  },
  rateDataset: async (rate: number,id:string): Promise<void> => {
    const response = await api.post(`/rateDataset/${id}`, { rate });
    return response.data;
  },
  approveDatasetById: async (id: string): Promise<void> => {
    const response = await api.post(`/approve/${id}`);
    return response.data;
  },
  rejectDataset: async (id:string,reason:string): Promise<void> => {
    const response=await api.post(`/rejectDataset/${id}`,{reason:reason})
    return response.data;
  },
  getDatasetByCategory: async (category:string): Promise<Dataset[] | null> => {
    const response=await api.get(`/datasets/category/${category}`);
    return response.data;
  },
  getDatasetByUser: async (email:string): Promise<Dataset[] | null> => {
    const response=await api.get(`/datasets/user/${email}`);
    return response.data;
  },
};
