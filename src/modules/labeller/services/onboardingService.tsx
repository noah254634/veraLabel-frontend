import { api } from "../../../shared/types/api"
import type{ LabellerProfile } from "../types/types";

export const onboardService = {
    createLabellerProfile: async (formData: LabellerProfile | any): Promise<any> => {
        const response = await api.post("/onboarding/createLabellerProfile", formData)
        return response.data
    },
    getLabeller: async (): Promise<void> => { },
    getLabellerOnboardingStatus: async (): Promise<void> => { },
    assignedTasks: async (): Promise<void> => { },
    submitTask: async (): Promise<void> => { },
    getTraineeSlides: async (): Promise<void> => { },
    getBronzeSlides: async (): Promise<void> => { },
    getSilverSlides: async (): Promise<void> => { },
    getGoldSlides: async (): Promise<void> => { },
    getTraineeQuiz: async (): Promise<void> => { },
    getBronzeQuiz: async (): Promise<void> => { },
    getSilverQuiz: async (): Promise<void> => { },
    getGoldQuiz: async (): Promise<void> => { },
    completeOnboarding: async (): Promise<any> => {
        const response = await api.post("/onboarding/completeOnboarding");
        return response.data;
    }
}