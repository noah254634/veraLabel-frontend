import { api } from "../../../shared/types/api"
import type { Dataset } from "../../../shared/types/dataset"
export const buyerService={
    finalizePayment:async(reference:string):Promise<any>=>{
        const response = await api.get(`/payments/success/${reference}`)
        return response.data
    },
    getDatasets:async():Promise<Dataset[]>=>{
        const response=await api.get("/datasets/buyerSideDatasets")
        return response.data
    },

    checkOut:async(datasetId:string,isExclusive:boolean):Promise<string>=>{
        const response=await api.post<{url: string}>("/payments/create",{
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