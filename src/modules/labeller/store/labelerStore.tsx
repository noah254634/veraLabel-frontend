import { create } from "zustand";
import type { Dataset } from "../../../shared/types/dataset";
import type { User } from "../../../shared/types/user";

type LabelerStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  datasets: Dataset[];
  setDatasets: (datasets: Dataset[]) => void;
  reset: () => void;
};

export const useLabelerStore = create<LabelerStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  datasets: [],
  setDatasets: (datasets) => set({ datasets }),
  reset: () => set({ user: null, datasets: [] }),
}));