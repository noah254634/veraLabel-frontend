import { toast } from "react-hot-toast";
import { api } from "../../../shared/types/api";
import type { Dataset } from "../../../shared/types/dataset";
import type { datasetRequest } from "../types/datasetRequest";
export const buyerService = {
  uploadFile: async (data: FormData): Promise<void> => {
    const file = data.get("uploadedFile") as File;
    const fileType = file?.type;
    const fileSize = file?.size;
    const budget = data.get("budget");
    const specifications = data.get("specifications");
    const domain = data.get("domain");
    const volume = data.get("volume");
    const format = data.get("format");
    const sourceLink = data.get("sourceLink");
    console.log(file);
    const response = await api.post("/datasets/generateUploadUrl", {
      fileType,
      fileSize,
      budget,
      specifications,
      domain,
      volume,
      format,
      sourceLink,
    });
    toast.success("File staged for transmission");
    const { uploadUrl, key } = response.data;
    console.log(uploadUrl,key);
    if (file && uploadUrl) {
      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });
    }
    const confirmResponse = await api.post("/datasets/confirmUpload", {
      key,
      })

    return confirmResponse.data;
  },
  getOrders: async (): Promise<any> => {
    const response = await api.get("/marketplace/orders");
    return response.data;
  },
  finalizePayment: async (reference: string): Promise<any> => {
    const response = await api.get(`/payments/success/${reference}`);
    return response.data;
  },
  getDatasets: async (): Promise<Dataset[]> => {
    const response = await api.get("/datasets/buyerSideDatasets");
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
  datasetRequest: async (data: FormData): Promise<void> => {
    const response = await api.post("/marketplace/send-dataset-request", data);
    return response.data;
  },
};
