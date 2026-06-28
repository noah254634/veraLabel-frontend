import { create } from "zustand";
import type { User } from "../../shared/types/user";
import { loginApi,signupApi, type LoginCredentials,type SignupCredentials} from "./authApi";
import {toast} from "react-hot-toast";
import { api } from "../../shared/types/api";
import { buildApiUrl } from "../../shared/utils/apiUrl";
type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  isRestoringSession: boolean;
  error: string | null;
  signup: (credentials: SignupCredentials) => Promise<User | void>;
  login: (credentials: LoginCredentials) => Promise<User>;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  forgotPassword: (email: string) => Promise<string>;
  checkAuth: () => Promise<void>;
  syncAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  isRestoringSession: typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true",
  error: null,
  checkAuth: async () => {
    try {
      set({ loading: true, isRestoringSession: false });
      const response = await fetch(buildApiUrl("/auth/me"), {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      const data = await response.json();
      // ResponseHandler wraps payload in { success, message, data, timestamp }
      const user = data?.data?.user ?? data?.user ?? null;
      set({ user, isAuthenticated: true, loading: false });

    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  forgotPassword: async (email: string): Promise<string> => {
    const response = await api.post("/auth/forgotPassword", { email });
    return response.data?.message ?? "Reset email sent";
  },
  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  syncAuth: async () => {
    const hasStoredSession = localStorage.getItem("isAuthenticated") === "true";
    if (!hasStoredSession) {
      set({ loading: false, isRestoringSession: false });
      return;
    }
    set({ loading: true, isAuthenticated: false, isRestoringSession: true });
    try {
      const res = await api.get("/auth/me");
      if (res.status === 200) {
        // ResponseHandler shape: { success, message, data: { user }, timestamp }
        const user = res.data?.data?.user ?? res.data?.user ?? null;
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ loading: false, isRestoringSession: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ loading: true, error: null, isRestoringSession: false });
      const response = await loginApi(credentials);
      const data = await response.json();
      // ResponseHandler shape: { success, message, data: { user }, timestamp }
      const user = data?.data?.user ?? data?.user ?? null;

      if (!user) {
        throw new Error('User data missing from response');
      }

      set({ user, isAuthenticated: true, loading: false });
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Login successful");
      return user;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "An unknown error occurred";
      set({ error: errorMsg, loading: false });
      throw err;
    }
  },
  signup: async (credentials) => {
    try {
      set({ loading: true, error: null, isRestoringSession: false });  
      const response = await signupApi(credentials);
      const data = await response.json();
      // ResponseHandler shape: { success, message, data: { user }, timestamp }
      const user = data?.data?.user ?? data?.user ?? null;
      set({ loading: false });
      toast.success("Signup successful. Verification code sent to email.");
      return user;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "An unknown error occurred", loading: false });
      throw err;
    }
  },
  logout: async() =>{
    try{
      set({error:null, isRestoringSession: false});
      const response = await fetch(buildApiUrl("/auth/logout"),{
        method:"POST",
        credentials:"include",
        });
        if(!response.ok){
          const errorData = await response.json().catch(() => null);
          const errorMessage = errorData?.message || errorData?.error || response.statusText;
          toast.error(`Logout failed: ${errorMessage}`);
          throw new Error(errorMessage);
        }
      set({ user: null, isAuthenticated: false, loading: false });
      localStorage.removeItem("isAuthenticated");
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "An unknown error occurred", loading: false });
    }
  },
}));
