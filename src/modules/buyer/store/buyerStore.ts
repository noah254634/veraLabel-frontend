import { toast } from "react-hot-toast";
import { create } from "zustand";
import type { Buyer } from "../types/buyer";
import type { Order } from "../types/order";
import type { Dataset } from "../../../shared/types/dataset";
import { buyerService } from "../service/buyerService";
import type{ datasetRequest } from "../types/datasetRequest";
type BuyerStore = {
  datasets:Dataset[]
  getDatasets:()=>Promise<Dataset[]>
  getDatasetByCategory:()=>Promise<Dataset[]>
  error:string|null
  setError:(error:string|null)=>void
  loading:boolean
  setLoading:(loading:boolean)=>void
  searchBySize:(size:string)=>Promise<Dataset|void>
  searchByRatinng:(rate:number)=>Promise<Dataset|void>
  searchByPrice:(price:number)=>Promise<Dataset|void>
  checkOut:(datasetId:string,datasetPrice:number)=>Promise<string>
  datasetRequest:(request:datasetRequest)=>Promise<void>

  
};
const useBuyerStore = create<BuyerStore>((set,get)=>({
  datasets:[],
  error:null,
  setError:(error)=>set({error}),
  loading:false,
  setLoading:(loading)=>set({loading}),
  searchBySize:async()=>{},
  getDatasets:async():Promise<Dataset[]>=>{ return [] },
  getDatasetByCategory:async()=>{ return [] },
  searchByRatinng:async()=>{},
  searchByPrice:async()=>{},
  checkOut:async(datasetId:string,datasetPrice:number)=>{
    const url=await buyerService.checkOut(datasetId,datasetPrice)
    return url
  },
  datasetRequest:async()=>{
    try{
      const response=await buyerService.datasetRequest()
      set({loading:false})
      console.log(response)
      return response
    }catch(err){
      const errorMessage=err instanceof Error?err.message:"something went wrong"
      console.log(errorMessage)
      toast.error(errorMessage)
      set({loading:false})
    }
  }
}))
export default useBuyerStore;