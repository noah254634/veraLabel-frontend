
type Gender = "male" | "female" | "other";
export type Tier="Trainee"|"Bronze"|"Silver"|"Gold";
export interface LabellerProfile{
  gender?:Gender;
  dateOfBirth?: string | Date;
  age?:number;
  expertise?:
    | string
    | {
        skills?: string[];
        annotationTypes?: string[];
        toolsUsed?: string[];
        yearsOfExperience?: number;
        description?: string;
      };
  languages?:string | string[];
  location?:{
    country:string;
    city:string;
    region:string;
  };
  performance?: {
    totalTasksAssigned?: number;
    totalTasksCompleted?: number;
    totalTasksRejected?: number;
    averageQualityScore?: number;
    completionRate?: number;
    reliabilityScore?: number;
    approvalRate?: number;
  };
  earnings?: {
    totalEarned?: number;
    currentBalance?: number;
    pendingPayment?: number;
    totalPayouts?: number;
  };
  training?: {
    completedTiers?: string[];
    trainingProgress?: number;
    certifications?: Array<Record<string, unknown>>;
    currentTrainingTier?: string;
  };
  activityMetrics?: {
    loginCount?: number;
    streakDays?: number;
    lastActiveAt?: string | Date;
  };
  preferences?: {
    preferredTaskTypes?: string[];
    maxConcurrentTasks?: number;
    autoAcceptQualifyingTasks?: boolean;
    notificationPreferences?: {
      emailNotifications?: boolean;
      taskAssignments?: boolean;
      paymentNotifications?: boolean;
    };
  };
  profile?: {
    gender?: Gender;
    dateOfBirth?: string | Date;
    location?: {
      country: string;
      city: string;
      region: string;
    };
    languages?: string[];
  };
  userId?: string | {
    _id?: string;
    name?: string;
    email?: string;
    profilePicture?: string;
    role?: string;
    status?: string;
  };
  _id?: string;
  currentAssignedTasks?: string[];
  completedTasksLog?: Array<Record<string, unknown>>;
  reviews?: Array<Record<string, unknown>>;
  labellerTotalEarningd?:string;
  completedTasks?:string;
  isOnboarded?:boolean;
  tier?:Tier;
  status?: string;
  averageRating?: number;
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
