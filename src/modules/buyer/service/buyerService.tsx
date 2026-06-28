import { api } from "../../../shared/types/api";
import type { Dataset } from "../../../shared/types/dataset";
export const buyerService = {
  datasetOrders: async (): Promise<any> => {
    const response = await api.get("/buyer/datasetOrders");
    return response.data?.data || response.data;
  },
  generateUploadUrl: async (fileType: string): Promise<{ uploadUrl: string; key: string }> => {
    const response = await api.post("/datasets/generateUploadUrl", {
      fileType,
    });
    return response.data?.data || response.data;
  },
  uploadFile: async (file: File, uploadUrl: string, contentType?: string): Promise<void> => {
    if (!file) {
      throw new Error("Please attach a file before upload");
    }
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": contentType || file.type || "application/octet-stream",
      },
      body: file,
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      throw new Error(`Cloud storage upload failed (${response.status}): ${errorText || response.statusText}`);
    }
  },
  confirmUpload: async (r2Key: string, datasetId: string, dataType: string): Promise<any> => {
    const response = await api.post("/datasets/confirmUpload", {
      r2Key,
      datasetId,
      dataType,
    });
    return response.data?.data || response.data;
  },
  getOrders: async (): Promise<any> => {
    const response = await api.get("/buyer/orders");
    const payload = response.data?.data || response.data;
    return payload?.orders || response.data?.orders || [];
  },
  finalizePayment: async (reference: string): Promise<any> => {
    const response = await api.get(`/payments/success/${reference}`);
    return response.data?.data || response.data;
  },
  getDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets/buyerSideDatasets");
    return response.data?.data || response.data;
  },
  getPaymentHistory: async (): Promise<any> => {
    const response = await api.get("/payments/history");
    return response.data?.data || response.data;
  },
  checkOut: async (
    datasetId: string,
    isExclusive: boolean,
  ): Promise<string> => {
    const response = await api.post("/payments/create", {
      datasetId,
      isExclusive,
    });
    console.log(response);
    const payload = response.data?.data || response.data;
    return payload?.url || response.data?.url || "";
  },
  datasetRequest: async (requestData: {
    name: string;
    domain: string;
    specifications: string;
    volume: string;
    format: string;
    budget: string | number;
    fileUrl: string;
    timeline: string;
    qualityMetrics: string;
    labellingMethod: "rlhf" | "classification" | "annotation" | "transcription";
    contentType: "text" | "audio" | "video" | "image" | "code" | "document";
    instructionId?: string;
    buyerAnswers?: any[];
    intent?: string;
    timelineDays?: number;
    maxLabellers?: number;
  }): Promise<any> => {
    const response = await api.post("/datasets/createDataset", {
      ...requestData,
      budget: typeof requestData.budget === 'string'
        ? parseFloat(requestData.budget)
        : requestData.budget
    });
    return response.data?.data || response.data;
  },

  getBuyerProfile: async (): Promise<any> => {
    const response = await api.get("/buyer/me");
    return response.data?.data || response.data;
  },

  submitOnboarding: async (details: {
    companyName: string;
    website: string;
    linkedin: string;
    industry: string;
    companySize: string;
    intendedUseCase: string;
  }): Promise<any> => {
    const response = await api.post("/buyer/onboarding", details);
    return response.data?.data || response.data;
  },
  downloadDataset: async (id: string): Promise<string> => {
    const response = await api.get(`/datasets/${id}/download`);
    return response.data?.data?.downloadUrl || response.data?.downloadUrl;
  },
};

