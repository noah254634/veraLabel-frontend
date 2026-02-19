import { create } from "zustand";
import type { User } from "../../../shared/types/user";
import type{ Dataset } from "../../../shared/types/dataset";
type AdminStore = {
  user: User | null;
  setUser: (user: User) => void;
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  datasets:Dataset[];
  setDatasets: (datasets: Dataset[]) => Promise<void>;
  // error: string | null;
};
const useStore = create<AdminStore>((set) => ({
  user: null as User | null,
  setUser: (user: User) => set({ user, isAuthenticated: true, loading: false }),
  isAuthenticated: false,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  setDatasets: async (datasets: Dataset[]) => set({ datasets }),
  datasets: [],

}));

export default useStore;
