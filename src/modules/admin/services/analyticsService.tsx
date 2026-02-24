import { api } from "../../../shared/types/api"
import type { User } from "../../../shared/types/user";
export const analyticsService={
    fetchTotalUsers:async():Promise<number>=>{
        const response=await api.get("/users/totalUsers");
        return response.data
    },
    fetchTotalDatasets:async():Promise<number>=>{
        const response=await api.get("/datasets/totalDatasets")
        return response.data
    },
    fetchVerifiedUsers:async():Promise<number>=>{
        const response=await api.get("users/verified");
        return response.data
    },
    fetchPendingDatasets:async():Promise<number>=>{
        const response=await api.get("/datasets/pending");
        return response.data
    },
    fetchTodaysSignup:async():Promise<number>=>{
        const response=await api.get("/users/todaysSignup");
        return response.data
    },
    fetchMostSoldDataset:async():Promise<number>=>{
        const response=await api.get("/analytics/mostSold");
        return response.data
    },
    fetchActiveAnnotators:async():Promise<User[]|null>=>{
        const response=await api.get("/analytics/activeAnnotators")
        return response.data
    },
    fetchPrivateDatasets:async():Promise<number>=>{
        const response=await api.get("analytics/privateDatasets")
        return response.data
    },
    fetchActiveBuyers:async():Promise<User[]|null>=>{
        const response=await api.get("/analytics/activeBuyers")
        return response.data
    },
    fetchVerifiedAnnotators:async():Promise<User[]|null>=>{
        const response=await api.get("/analytics/verifiedAnnotators")
        return response.data
    }
}