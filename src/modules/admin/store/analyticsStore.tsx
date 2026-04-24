import { analyticsService } from "../services/analyticsService";
import {create} from "zustand"
import toast from "react-hot-toast";
import type { Analytics, LabellerAnalyticsState, TasksAnalyticsState } from "../types/analyticsTypes"

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

export const labellerAnalyticsStore = create<LabellerAnalyticsState>((set) => ({
    labellerOverview: null,
    labellerPerformance: null,
    labellerTiers: null,
    labellerEarnings: null,
    labellerActivity: null,
    labellerTaskCompletion: null,
    labellerRatings: null,
    loading: true,
    error: null,
    setError: (error: string | null) => set({ error }),
    fetchLabellerAnalytics: async () => {
        try {
            set({ loading: true, error: null });
            const [overviewData, performanceData, tiersData, earningsData, activityData, taskCompletionData, ratingsData] = await Promise.all([
                analyticsService.getLabellerStats(),
                analyticsService.getLabellerPerformance(),
                analyticsService.getLabellerTiers(),
                analyticsService.getLabellerEarnings(),
                analyticsService.getLabellerActivity(),
                analyticsService.getLabellerTaskCompletion(),
                analyticsService.getLabellerRatings(),
            ]);
            set({
                labellerOverview: overviewData,
                labellerPerformance: performanceData,
                labellerTiers: tiersData,
                labellerEarnings: earningsData,
                labellerActivity: activityData,
                labellerTaskCompletion: taskCompletionData,
                labellerRatings: ratingsData,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch labeller statistics';
            set({ error: message });
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },
}))

export const tasksAnalyticsStore = create<TasksAnalyticsState>((set) => ({
    queueHealth: null,
    velocity: null,
    distribution: null,
    qualityMetrics: null,
    topDatasets: null,
    loading: true,
    error: null,
    setError: (error: string | null) => set({ error }),
    fetchTasksAnalytics: async () => {
        try {
            set({ loading: true, error: null });
            const [queueData, velocityData, distributionData, qualityData, datasetsData] = await Promise.all([
                analyticsService.getTasksQueueHealth(),
                analyticsService.getTasksVelocity(),
                analyticsService.getTasksDistribution(),
                analyticsService.getTasksQualityMetrics(),
                analyticsService.getTopDatasets(),
            ]);
            set({
                queueHealth: queueData,
                velocity: velocityData,
                distribution: distributionData,
                qualityMetrics: qualityData,
                topDatasets: datasetsData,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch tasks analytics';
            set({ error: message });
            toast.error(message);
        } finally {
            set({ loading: false });
        }
    },
}))
