import { api } from "../../../shared/types/api"
import type{ LabellerProfile } from "../types/types";
import type{Tier} from "../types/types";
import type{ Task } from "../types/task";
export const labellerService={
    createLabellerProfile:async():Promise<void>=>{},
    getLabeller:async():Promise<void>=>{},
    getLabellerOnboardingStatus:async():Promise<void>=>{},
    assignedTasks:async():Promise<void>=>{},
    submitTask:async():Promise<void>=>{},
    getTraineeSlides:async():Promise<void>=>{},
    getBronzeSlides:async():Promise<void>=>{},
    getSilverSlides:async():Promise<void>=>{},
    getGoldSlides:async():Promise<void>=>{},
    getTraineeQuiz:async():Promise<void>=>{},
    getBronzeQuiz:async():Promise<void>=>{},
    getSilverQuiz:async():Promise<void>=>{},
    getGoldQuiz:async():Promise<void>=>{},

}