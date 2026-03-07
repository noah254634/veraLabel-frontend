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
            console.log(formData)
            const payload = {
                ...formData,
                skillTags: formData.annotationExperience?.experienceTypes || [],
                expertise: formData.expertise ? formData.expertise.split(",").map((s) => s.trim()).filter((s) => s !== "") : [],
            };
            const response=await onboardService.createLabellerProfile(payload)
            set({loading:false})
            toast.success("Profile created successfully")
            return response
        }catch(err){
            const erroeMessage=err instanceof Error?err.message:"Something went wrong"
            toast.error(erroeMessage)
        }
    },
    setLabeller:async(labeller)=>{set({labeller})},
    getLabeller:async()=>({} as LabellerProfile),
    getLabellerOnboardingStatus:async()=>false,
    getLabellerTier:async()=>"Trainee",
    getCompletedTasks:async()=>"0",
    assignedTasks:async()=>({} as Task),
    submitTask:async(task)=>{},
    getTraineeSlides:async()=>"",
    getBronzeSlides:async()=>"",
    getSilverSlides:async()=>"",
    getGoldSlides:async()=>"",
    getTraineeQuiz:async()=>"",
    getBronzeQuiz:async()=>"",
    getSilverQuiz:async()=>"",
    getGoldQuiz:async()=>"",

}))