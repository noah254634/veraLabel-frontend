import { create } from "zustand";
import type { Dataset } from "../../../shared/types/dataset";
import type { User } from "../../../shared/types/user";
import type { LabellerProfile, Tier } from "../types/types";
import type { Task } from "../types/task";
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
  assignedTasks: () => Promise<Task>;
  submitTask: (task: Task) => Promise<void>;
};

export const useLabelerStore = create<LabelerStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  datasets: [],
  setDatasets: (datasets) => set({ datasets }),
  reset: () => set({ user: null, datasets: [] }),
  labeller: {} as LabellerProfile,
  setLabeller: async (labeller) => set({ labeller }),
  getLabeller: async () => ({} as LabellerProfile),
  getLabellerOnboardingStatus: async () => false,
  getLabellerTier: async () => "Trainee",
  getCompletedTasks: async () => "0",
  assignedTasks: async () => ({} as Task),
  submitTask: async (task) => {}
}));
