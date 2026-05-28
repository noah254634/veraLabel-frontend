import { api } from "../../../shared/types/api"
import type{ LabellerProfile } from "../types/types";
export const labellerService={
    createLabellerProfile: async (payload: LabellerProfile | any): Promise<any> => {
        const response = await api.post("/onboarding/createLabellerProfile", payload)
        return response.data.data
    },
    getLabeller: async (): Promise<any> => {
        const response = await api.get("/onboarding/getLabellerProfile")
        return response.data.data
    },
    getLabellerOnboardingStatus: async (): Promise<any> => {
        const response = await api.get("/onboarding/getLabellerProfile")
        return Boolean(response.data?.data?.isOnboarded)
    },
    assignedTasks: async (): Promise<any> => {
        const response = await api.get("/labeller/tasks/assigned")
        return response.data.data
    },
    submitTask: async (taskId: string, batchId: string): Promise<any> => {
        const response = await api.put(`/tasks/submit/${taskId}`, { batchId })
        return response.data.data
    },
    getTraineeSlides: async (): Promise<any> => {},
    getBronzeSlides: async (): Promise<any> => {},
    getSilverSlides: async (): Promise<any> => {},
    getGoldSlides: async (): Promise<any> => {},
    getTraineeQuiz: async (): Promise<any> => {},
    getBronzeQuiz: async (): Promise<any> => {},
    getSilverQuiz: async (): Promise<any> => {},
    getGoldQuiz: async ():Promise<any> => {},

}