import { api } from "../../../shared/types/api"
import type { Dataset } from "../../../shared/types/dataset"
import type{ PaymentUrl } from "../types/buyer"
export const buyerService={
    getDatasets:async():Promise<Dataset[]>=>{
        const response=await api.get("/datasets/buyerSideDatasets")
        return response.data
    },

    checkOut:async(datasetId:string,isExclusive:boolean):Promise<PaymentUrl>=>{
        const response=await api.post("/payments/create",{
            datasetId,
            isExclusive
        })
        console.log(response)
        return response.data.url
    

    },
    datasetRequest:async(data:FormData):Promise<void>=>{
        const response=await api.post("/marketplace/send-dataset-request",data)
        return response.data
    }
}