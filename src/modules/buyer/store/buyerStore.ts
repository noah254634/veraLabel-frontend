import { toast } from "react-hot-toast";
import { create } from "zustand";
import type { Buyer } from "../types/buyer";
import type { Order } from "../types/order";
import type { CartOperations } from "../types/cartOperattions";
import type { CartItem, Cart } from "../types/cart";
import type { Dataset } from "../../../shared/types/dataset";
import { buyerService } from "../service/buyerService";

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
  }
}))
export default useBuyerStore;