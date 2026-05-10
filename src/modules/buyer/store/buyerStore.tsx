import { toast } from "react-hot-toast";
import { create } from "zustand";
import type { Buyer } from "../types/buyer";
import type { OrderType } from "../types/order";
import type { Dataset } from "../../../shared/types/dataset";
import { buyerService } from "../service/buyerService";
import type{ datasetRequest } from "../types/datasetRequest";
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
  uploadFileToS3:(file:File, uploadUrl:string)=>Promise<void>
  confirmUpload:(r2Key:string, datasetId:string, dataType:string)=>Promise<any>
  datasetRequest:(request:{domain:string; specifications:string; volume:string; format:string; budget:number | string; fileUrl:string; timeline:string; qualityMetrics:string})=>Promise<void>
  finalizePayment:(reference:string)=>Promise<any>
  getOrders:()=>Promise<OrderType[]|void>
  getPaymentHistory:()=>Promise<any>

};
const useBuyerStore = create<BuyerStore>((set,get)=>({
  datasets:[],
  buyerDatasetOrders:[],
  buyerDatasetStats: null,
  error:null,
  setError:(error)=>set({error}),
  loading:false,
  setLoading:(loading)=>set({loading}),
  searchBySize:async()=>{},
  getDatasetOrders:async()=>{
    set({loading:true})
    try{
      const response=await buyerService.datasetOrders()
      set({
        loading:false, 
        buyerDatasetOrders: response.buyerDatasetOrders || [],
        buyerDatasetStats: response.stats || null
      })
      return response.buyerDatasetOrders
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
  uploadDataset:async(data)=>{
    set({loading:true})
    try{
      const response=await buyerService.uploadFile(data)
      set({loading:false})
      console.log(response)
      return response
    
    }catch(err){
      const errorMessage = err instanceof Error ? err.message : "Upload failed";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
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
  uploadFileToS3:async(file, uploadUrl)=>{
    set({loading:true})
    try{
      await buyerService.uploadFile(file, uploadUrl)
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
      set({loading:false, datasets:response})
      return response 
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
  getPaymentHistory:async()=>{
    try{
      set({loading:true})
      const response=await buyerService.getPaymentHistory()
      set({loading:false})
      return response
    }catch(err){
      const errorMessage=err instanceof Error?err.message:"Failed to fetch payment history";
      console.error(errorMessage);
      toast.error(errorMessage);
      set({loading:false})
      throw err
    }
  }
}));

export { useBuyerStore };