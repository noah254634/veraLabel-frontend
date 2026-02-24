import {create} from "zustand"
import { analyticsService } from "../services/analyticsService"
import type{ Dataset } from "../../../shared/types/dataset"
import type{ User } from "../../../shared/types/user"
type analyticStore={
    users:User[]|null
    datasets:Dataset[]|null
    setDatasets:(datasets:Dataset[]|null)=>void
    setUser:(users:User[]|null)=>void
    totalUsers:()=>Promise<number>
    totalDatasets:()=>Promise<number>
    verifiedUsers:()=>Promise<number>
    pendingDatasets:()=>Promise<number>
    todaysSignUp:()=>Promise<number>
    privateDatasets:()=>Promise<number>
    mostSoldDataset:()=>Promise<number|null>
    activeAnnotators:()=>Promise<User[]|null>
    activeClients:()=>Promise<User[]|null>
    verifiedAnnotators:()=>Promise<User[]|null>


}
const analyticsUseStore=create<analyticStore>((set)=>({
    datasets:null,
    setDatasets:(datasets:Dataset[]|null)=>set({datasets}),
    users:null,
    setUser:(users:User[]|null)=>set({users}),
    totalUsers:async()=>{
        const users=await analyticsService.fetchTotalUsers();
        return users;
    },
    totalDatasets:async()=>{
        const totalDatasets=await analyticsService.fetchTotalDatasets();
        return totalDatasets
    },
    verifiedUsers:async()=>{
        const verifiedUsers=await analyticsService.fetchVerifiedUsers();
        return verifiedUsers
    },
    pendingDatasets:async()=>{
        const pendingDatasets=await analyticsService.fetchPendingDatasets();
        return pendingDatasets
    },
    todaysSignUp:async()=>{
        const todaysSignUp=await analyticsService.fetchTodaysSignup();
        return todaysSignUp
    },
    privateDatasets:async()=>{
        const privateDatasets=await analyticsService.fetchPrivateDatasets()
        return privateDatasets
    },
    mostSoldDataset:async()=>{
        const mostSold=await analyticsService.fetchMostSoldDataset();
        return mostSold
    },
    activeAnnotators:async()=>{
        const activeAnnotators=await analyticsService.fetchActiveAnnotators()
        return activeAnnotators
    },
    activeClients:async()=>{
        const activeBuyers=await analyticsService.fetchActiveBuyers()
        return activeBuyers
    },
    verifiedAnnotators:async()=>{
        const verifiedAnnotators=await analyticsService.fetchVerifiedAnnotators();
        return verifiedAnnotators
    },

}))
export default analyticsUseStore;