import type{ LabellerProfile } from "../types/types";
import type{Tier} from "../types/types";
import type{ Task } from "../types/task";
import { onboardService } from "../services/onboardingService";
import {create} from "zustand";
import toast from "react-hot-toast";
type OnboardStore={
    loading:boolean,
    setLoading:(loading:boolean)=>void,
    error:string|null,
    setError:(error:string)=>void,
    labeller:LabellerProfile,
    createLabellerProfile:(formData:LabellerProfile)=>Promise<void>,
    setLabeller:(labeller:LabellerProfile)=>Promise<void>,
    getLabeller:()=>Promise<LabellerProfile>
    getLabellerOnboardingStatus:()=>Promise<boolean>
    getLabellerTier:()=>Promise<Tier>
    getCompletedTasks:()=>Promise<string>,
    assignedTasks:()=>Promise<Task>,
    submitTask:(task:Task)=>Promise<void>
    getTraineeSlides:()=>Promise<string>
    getBronzeSlides:()=>Promise<string>
    getSilverSlides:()=>Promise<string>
    getGoldSlides:()=>Promise<string>
    getTraineeQuiz:()=>Promise<string>
    getBronzeQuiz:()=>Promise<string>
    getSilverQuiz:()=>Promise<string>
    getGoldQuiz:()=>Promise<string>
    completeOnboarding:()=>Promise<void>

}
export const useOnboardStore=create<OnboardStore>((set)=>({
    loading:false,
    setLoading:(loading)=>set({loading}),
    error:null,
    setError:(error)=>set({error}),
    labeller:{} as LabellerProfile,
    createLabellerProfile:async(formData:LabellerProfile)=>{    
        try{
            set({loading:true})
            set({error:null})
            const payload = {
                profile: {
                    gender: formData.gender,
                    dateOfBirth: formData.dateOfBirth,
                    location: formData.location,
                    languages: Array.isArray(formData.languages)
                        ? formData.languages
                        : formData.languages
                            ? [formData.languages]
                            : [],
                },
                expertise: {
                    skills: formData.expertise
                        ? formData.expertise.split(",").map((s) => s.trim()).filter((s) => s !== "")
                        : [],
                    annotationTypes: formData.annotationExperience?.experienceTypes || [],
                    toolsUsed: formData.annotationExperience?.toolsUsed || [],
                    yearsOfExperience: formData.annotationExperience?.experienceDuration,
                    description: formData.annotationExperience?.description,
                },
                tier: formData.tier,
                isOnboarded: formData.isOnboarded,
                annotationExperience: formData.annotationExperience,
            };
            const response=await onboardService.createLabellerProfile(payload)
            set({loading:false})
            toast.success("Profile created successfully")
            return response
        }catch(err){
            set({loading:false})
            const erroeMessage=err instanceof Error?err.message:"Something went wrong"
            toast.error(erroeMessage)
            throw err
        }
    },
    setLabeller:async(labeller)=>{set({labeller})},
    getLabeller:async()=>({} as LabellerProfile),
    getLabellerOnboardingStatus:async()=>false,
    getLabellerTier:async()=>"Trainee",
    getCompletedTasks:async()=>"0",
    assignedTasks:async()=>({} as Task),
    submitTask:async()=>{},
    getTraineeSlides:async()=>"",
    getBronzeSlides:async()=>"",
    getSilverSlides:async()=>"",
    getGoldSlides:async()=>"",
    getTraineeQuiz:async()=>"",
    getBronzeQuiz:async()=>"",
    getSilverQuiz:async()=>"",
    getGoldQuiz:async()=>"",
    completeOnboarding:async()=>{
        try{
            set({loading:true})
            await onboardService.completeOnboarding()
            set({loading:false})
        }catch(err){
            set({loading:false})
            toast.error("Failed to complete onboarding")
            throw err
        }
    }

}))