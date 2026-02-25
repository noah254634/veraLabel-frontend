import { analyticsService } from "../services/analyticsService";
import {create} from "zustand"
import type { AnalyticsOverview } from "../services/analyticsService"
import toast from "react-hot-toast";
type Analytics={
    overview: AnalyticsOverview | null,
    error:string|null
    setError:(error:string|null)=>void
    loading:boolean
    setLoading:(loading:boolean)=>void
    getAnalytics:()=>Promise<AnalyticsOverview | void>


};
export const analyticsStore=create<Analytics>((set)=>({
    overview: null,
    error:null,
    setError:(error:string|null)=>set({error}),
    loading:false,
    setLoading:(loading:boolean)=>set({loading}),
    getAnalytics:async()=>{
        try {
            set({loading:true})
            const response=await analyticsService.getAnalytics()
            set({ overview: response })
            toast.success("Analytics fetched successfully")
            console.log(response)
            return response
        } catch (error) {
            console.log(error)
        }finally{
            set({loading:false})
        }
    }

}))
