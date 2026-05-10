import { toast } from "react-hot-toast";
import { api } from "../../../shared/types/api";
import type { Dataset } from "../../../shared/types/dataset";
export const buyerService = {
  datasetOrders: async (): Promise<any> => {
    const response = await api.get("/marketplace/datasetOrders");
    return response.data;
  },
  generateUploadUrl: async (fileType: string): Promise<{ uploadUrl: string; key: string }> => {
    const response = await api.post("/datasets/generateUploadUrl", {
      fileType,
    });
    return response.data;
  },
  uploadFile: async (file: File, uploadUrl: string): Promise<void> => {
    if (!file) {
      throw new Error("Please attach a file before upload");
    }
    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });
  },
  confirmUpload: async (r2Key: string, datasetId: string, dataType: string): Promise<any> => {
    const response = await api.post("/datasets/confirmUpload", {
      r2Key,
      datasetId,
      dataType,
    });
    return response.data;
  },
  getOrders: async (): Promise<any> => {
    const response = await api.get("/marketplace/orders");
    return response.data.orders;
  },
  finalizePayment: async (reference: string): Promise<any> => {
    const response = await api.get(`/payments/success/${reference}`);
    return response.data;
  },
  getDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets/buyerSideDatasets");
    return response.data;
  },
  getPaymentHistory: async (): Promise<any> => {
    const response = await api.get("/payments/history");
    return response.data;
  },
  checkOut: async (
    datasetId: string,
    isExclusive: boolean,
  ): Promise<string> => {
    const response = await api.post<{ url: string }>("/payments/create", {
      datasetId,
      isExclusive,
    });
    console.log(response);
    return response.data.url;
  },
  datasetRequest: async (requestData: {
    domain: string;
    specifications: string;
    volume: string;
    format: string;
    budget: string | number;
    fileUrl: string;
    timeline: string;
    qualityMetrics: string;
  }): Promise<any> => {
    const response = await api.post("/datasets/createDataset", {
      ...requestData,
      budget: typeof requestData.budget === 'string'
        ? parseFloat(requestData.budget)
        : requestData.budget,
      volume: typeof requestData.volume === 'string'
        ? parseInt(requestData.volume)
        : requestData.volume
    });
    return response.data;
  },
};
