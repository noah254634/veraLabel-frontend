
type Gender = "male" | "female" | "other";
export type Tier="Trainee"|"Bronze"|"Silver"|"Gold";
export interface LabellerProfile{
  gender:Gender;
  age:number;
  expertise:string;
  languages:string;
  location:{
    country:string;
    city:string;
    region:string;
  };
  labellerTotalEarningd?:string;
  completedTasks?:string;
  isOnboarded?:boolean;
  tier:Tier;
  annotationExperience?:AnnotationExperience;

}
export interface AnnotationExperience {
  hasExperience: boolean

  experienceTypes?: (
    | "image_annotation"
    | "video_annotation"
    | "text_classification"
    | "audio_transcription"
    | "nlp_labeling"
  )[]

  toolsUsed?: string[]

  experienceDuration?: 
    | "less_than_3_months"
    | "3_to_12_months"
    | "1_to_3_years"
    | "3_plus_years"

  description?: string
}
