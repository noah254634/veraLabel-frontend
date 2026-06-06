import { create } from "zustand";
import type { Dataset } from "../../../shared/types/dataset";
import type { User } from "../../../shared/types/user";
import type { LabellerProfile, Tier } from "../types/types";
import { labellerService } from "../services/labellerService";
import { useAuthStore } from "../../auth/useAuthstore";

const normalizeLabellerProfile = (labeller: any): LabellerProfile => ({
  ...labeller,
  profile: labeller?.profile,
  userId: labeller?.userId?._id || labeller?.userId,
  tier: labeller?.tier,
  isOnboarded: labeller?.isOnboarded,
});
type LabelerStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  datasets: Dataset[];
  setDatasets: (datasets: Dataset[]) => void;
  reset: () => void;
  labeller: LabellerProfile;
  setLabeller: (labeller: LabellerProfile) => Promise<void>;
  getLabeller: () => Promise<LabellerProfile>;
  getLabellerOnboardingStatus: () => Promise<boolean>;
  getLabellerTier: () => Promise<Tier>;
  getCompletedTasks: () => Promise<string>;
};

export const useLabelerStore = create<LabelerStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  datasets: [],
  setDatasets: (datasets) => set({ datasets }),
  reset: () => set({ user: null, datasets: [] }),
  labeller: {} as LabellerProfile,
  setLabeller: async (labeller) => set({ labeller: normalizeLabellerProfile(labeller) }),
  getLabeller: async () => {
    const labeller = await labellerService.getLabeller();
    const normalized = normalizeLabellerProfile(labeller);
    set({ labeller: normalized });
    if (normalized.isOnboarded) {
      const user = useAuthStore.getState().user;
      if (user) {
        const key = `labellerOnboardingCompleted:${user._id ?? user.email}`;
        localStorage.setItem(key, "true");
      }
    }
    return normalized;
  },
  getLabellerOnboardingStatus: async () => {
    const labeller = await labellerService.getLabeller();
    return Boolean(labeller?.isOnboarded);
  },
  getLabellerTier: async () => {
    const labeller = await labellerService.getLabeller();
    return (labeller?.tier || "Trainee") as Tier;
  },
  // Bug #8: removed dead stubs — submitTask and assignedTasks are never called
  // from any component; the real implementations live in taskStore.tsx and
  // taskService.tsx respectively.
  getCompletedTasks: async () => "0",
}));

