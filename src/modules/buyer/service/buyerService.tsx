import { api } from "../../../shared/types/api"
import type{ PaymentUrl } from "../types/buyer"
export const buyerService={
    checkOut:async(datasetId:string,datasetPrice:number):Promise<PaymentUrl>=>{
        const response=await api.post("/marketplace/order",{
            datasetId,
            datasetPrice
        })
        return response.data
    

    },
    datasetRequest:async(data:FormData):Promise<void>=>{
        const response=await api.post("/marketplace/send-dataset-request",data)
        return response.data
    }
}