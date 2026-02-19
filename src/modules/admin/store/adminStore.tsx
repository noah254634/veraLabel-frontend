import { create } from "zustand";
import type { User } from "../../../shared/types/user";
type AdminStore = {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  register: (data: any) => Promise<void>;
  login: (data: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
  // error: string | null;
};
const useStore = create<AdminStore>((set) => ({
  user: null as User | null,
  setUser: (user: User) => set({ user, isAuthenticated: true, loading: false }),
  logout: () => set({ user: null, isAuthenticated: false, loading: false }),
  isAuthenticated: false,
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
  login: async () => {},
  register: async () => {},
 

}));

export default useStore;
