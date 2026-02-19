import { create } from "zustand";
import type { User } from "../shared/types/user";

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  login: (user) => set({ user, isAuthenticated: true, loading: false }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));