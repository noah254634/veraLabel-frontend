import { toast } from "react-hot-toast";
import { create } from "zustand";
import type { OrderType } from "../types/order";
import type { Dataset } from "../../../shared/types/dataset";
import { buyerService } from "../service/buyerService";

const normalizeDatasets = (response: unknown): Dataset[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === "object") {
    const payload = response as {
      datasets?: unknown;
      data?: unknown;
    };

    if (Array.isArray(payload.datasets)) {
      return payload.datasets as Dataset[];
    }

    if (payload.data && typeof payload.data === "object") {
      const nested = payload.data as { datasets?: unknown };
      if (Array.isArray(nested.datasets)) {
        return nested.datasets as Dataset[];
      }
    }
  }

  return [];
};

const normalizePayments = (response: unknown): any[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (response && typeof response === "object") {
    const payload = response as {
      payments?: unknown;
      data?: unknown;
    };

    if (Array.isArray(payload.payments)) {
      return payload.payments as any[];
    }

    if (payload.data && typeof payload.data === "object") {
      const nested = payload.data as { payments?: unknown };
      if (Array.isArray(nested.payments)) {
        return nested.payments as any[];
      }
    }
  }

  return [];
};

const unwrapResponseData = (response: unknown): Record<string, unknown> | unknown => {
  if (response && typeof response === "object" && "data" in response) {
    const payload = response as { data?: unknown };
    return payload.data ?? response;
  }

  return response;
};

type BuyerStore = {
  datasets:Dataset[]
  buyerDatasetOrders:any[]
  buyerDatasetStats: { totalSpent: number; activeAssets: number; pendingSync: number } | null
  getDatasets:()=>Promise<Dataset[]|void>
  getDatasetByCategory:()=>Promise<Dataset[]>
  error:string|null
  setError:(error:string|null)=>void
  loading:boolean
  getDatasetOrders:()=>Promise<any>
  setLoading:(loading:boolean)=>void
  searchBySize:(size:string)=>Promise<Dataset[]|void>
  searchByRating:(rate:number)=>Promise<Dataset[]|void>
  searchByPrice:(price:number)=>Promise<Dataset[]|void>
  checkOut:(datasetId:string,isExclusive:boolean)=>Promise<string>
  generateUploadUrl:(fileType:string)=>Promise<{uploadUrl:string; key:string}>
  uploadFileToS3:(file:File, uploadUrl:string, contentType?:string)=>Promise<void>
  confirmUpload:(r2Key:string, datasetId:string, dataType:string)=>Promise<any>
  datasetRequest:(request:{name: string; domain:string; specifications:string; volume:string; format:string; budget:number | string; fileUrl:string; timeline:string; qualityMetrics:string; labellingMethod:"rlhf" | "classification" | "annotation" | "transcription"; contentType:"text" | "audio" | "video" | "image" | "code" | "document"; instructionId?: string; buyerAnswers?: any[]; intent?: string; timelineDays?: number; maxLabellers?: number})=>Promise<any>
  finalizePayment:(reference:string)=>Promise<any>
  getOrders:()=>Promise<OrderType[]|void>
  getPaymentHistory:()=>Promise<any>
  getProtocols:(domain: string, labellingMethod: string)=>Promise<any[]>
  buyerProfile: any | null
  getBuyerProfile: () => Promise<any>
  submitOnboarding: (details: any) => Promise<any>
  downloadDataset: (id: string) => Promise<string>
};
const useBuyerStore = create<BuyerStore>((set)=>({
  datasets:[],
  buyerDatasetOrders:[],
  buyerDatasetStats: null,
  buyerProfile: null,
  error:null,
  setError:(error)=>set({error}),
  loading:false,
  setLoading:(loading)=>set({loading}),
  searchBySize:async()=>{},
  getDatasetOrders:async()=>{
    set({loading:true})
    try{
      const response=await buyerService.datasetOrders()
      const payload = unwrapResponseData(response) as {
        buyerDatasetOrders?: unknown;
        stats?: unknown;
        data?: {
          buyerDatasetOrders?: unknown;
          stats?: unknown;
        };
      };
      const buyerDatasetOrders = Array.isArray(payload.buyerDatasetOrders)
        ? payload.buyerDatasetOrders
        : Array.isArray(payload.data?.buyerDatasetOrders)
          ? payload.data.buyerDatasetOrders
          : [];
      const buyerDatasetStats = payload.stats ?? payload.data?.stats ?? null;
      set({
        loading:false, 
        buyerDatasetOrders,
        buyerDatasetStats: buyerDatasetStats as BuyerStore["buyerDatasetStats"]
      })
      return buyerDatasetOrders
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Failed to load dataset orders";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  getOrders:async()=>{
    set({loading:true})
    try{
      const response=await buyerService.getOrders()
      set({loading:false})
      return response
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  generateUploadUrl:async(fileType)=>{
    set({loading:true})
    try{
      const response=await buyerService.generateUploadUrl(fileType)
      set({loading:false})
      return response
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Failed to generate upload URL";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  uploadFileToS3:async(file, uploadUrl, contentType)=>{
    set({loading:true})
    try{
      await buyerService.uploadFile(file, uploadUrl, contentType)
      toast.success("File uploaded successfully");
      set({loading:false})
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "File upload failed";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  confirmUpload:async(r2Key, datasetId, dataType)=>{
    set({loading:true})
    try{
      const response=await buyerService.confirmUpload(r2Key, datasetId, dataType)
      toast.success("Upload confirmed, processing started");
      set({loading:false})
      return response
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Failed to confirm upload";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  getDatasets:async()=>{
    set({loading:true})
    try{
      const response=await buyerService.getDatasets()
      const datasets = normalizeDatasets(unwrapResponseData(response))
      set({loading:false, datasets})
      return datasets 
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Failed to load datasets";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  finalizePayment:async(reference)=>{
    set({loading:true})
    try {
      const response=await buyerService.finalizePayment(reference)
      set({loading:false})
      console.log(response)
      return response
    } catch (error) {
      set({loading:false})
      throw error
    }
  },
  getDatasetByCategory:async()=>{ return [] },
  searchByRating:async()=>{},
  searchByPrice:async()=>{},
  checkOut:async(datasetId:string,isExclusive:boolean)=>{
    set({loading:true})
    const url=await buyerService.checkOut(datasetId,isExclusive)
    set({loading:false})
    console.log(url)
    return url
  },
  datasetRequest:async(credential)=>{
    try{
      set({loading:true})
      const response=await buyerService.datasetRequest(credential)
      toast.success("Dataset request created successfully");
      set({loading:false})
      return response
    }catch(err){
      const errorMessage=err instanceof Error?err.message:"Failed to create dataset request";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  getProtocols: async(domain: string, labellingMethod: string)=>{
    try{
      const { api } = await import('../../../shared/types/api');
      const res = await api.get(`/instructions?domain=${encodeURIComponent(domain)}&labellingMethod=${encodeURIComponent(labellingMethod)}`);
      if (res.data && res.data.data && Array.isArray(res.data.data.templates)) {
        return res.data.data.templates;
      }
      if (res.data && Array.isArray(res.data.templates)) {
        return res.data.templates;
      }
      if (Array.isArray(res.data)) {
        return res.data;
      }
      return [];
    }catch(err){
      return [];
    }
  },
  getPaymentHistory:async()=>{
    try{
      set({loading:true})
      const response=await buyerService.getPaymentHistory()
      const payments = normalizePayments(unwrapResponseData(response))
      set({loading:false})
      return payments
    }catch(err){
      const errorMessage=err instanceof Error?err.message:"Failed to fetch payment history";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  },
  getBuyerProfile: async () => {
    set({ loading: true });
    try {
      const response = await buyerService.getBuyerProfile();
      const payload = unwrapResponseData(response) as { buyer?: any };
      const buyerProfile = payload.buyer ?? payload ?? null;
      set({ loading: false, buyerProfile });
      return buyerProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load buyer profile";
      console.error(errorMessage);
      set({ loading: false });
      throw err;
    }
  },
  submitOnboarding: async (details) => {
    set({ loading: true });
    try {
      const response = await buyerService.submitOnboarding(details);
      const payload = unwrapResponseData(response) as { buyer?: any };
      const buyerProfile = payload.buyer ?? payload ?? null;
      set({ loading: false, buyerProfile });
      toast.success("Profile submitted successfully");
      return buyerProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to submit onboarding profile";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({ loading: false });
      throw err;
    }
  },
  downloadDataset: async (id: string) => {
    set({ loading: true });
    try {
      const url = await buyerService.downloadDataset(id);
      set({ loading: false });
      return url;
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to get download URL";
      toast.error(errorMessage);
      set({ loading: false });
      throw err;
    }
  },
}));

export { useBuyerStore };