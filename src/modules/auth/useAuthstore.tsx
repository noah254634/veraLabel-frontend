import { create } from "zustand";
import type { User } from "../../shared/types/user";
import { loginApi,signupApi, type LoginCredentials,type SignupCredentials} from "./authApi";
import {toast} from "react-hot-toast";
import { api } from "../../shared/types/api";
type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (credentials: SignupCredentials) => Promise<User | void>;
  login: (credentials: LoginCredentials) => Promise<User>;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  forgotPassword:()=>Promise<string>
  checkAuth: () => Promise<void>;
  syncAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  isAuthenticated: false,
  loading: false,
  error: null,
  checkAuth: async () => {
    try {
      set({ loading: true });
      const response = await fetch("http://localhost:5000/api/v1/auth/check-auth", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  forgotPassword:async():Promise<string>=>{
    const response=await api.get("/auth/forgotPassword")
    return response.data
  },
  setUser: (user) => set({ user, isAuthenticated: true }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  syncAuth: async () => {
    if (!localStorage.getItem("isAuthenticated")) {
      return;
    }
    set({ loading: true });
    try {
      const [res] = await Promise.all([
        api.get("/auth/me"), new Promise((resolve) => setTimeout(resolve, 1000))
      ]);
      console.log(res);
      if (res.status === 200) {
        // Fix: Extract user from the response object (which contains message and user)
        set({ user: res.data.user, isAuthenticated: true });
      }
    } catch (error) {
     toast.error("Authentication failed");
     console.log(error)
     
    } finally {
      set({ loading: false });
    }
  },

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await loginApi(credentials);
      const data = await response.json();
      const user = data.user;
      set({ user, isAuthenticated: true, loading: false });
      localStorage.setItem("isAuthenticated", "true");
      console.log(user);
      console.log(data.message);
      console.log(response);
      toast.success("Login successful");
      return user;
    } catch (err) {
      toast.error("Login failed");
      set({ error: err instanceof Error ? err.message : "An unknown error occurred", loading: false });
      throw err;
    }
  },
  signup: async (credentials) => {
    try {
      console.log(credentials);
      set({ loading: true, error: null });  
      const response = await signupApi(credentials);
      const data = await response.json();
      const user = data.user;
      set({ user, isAuthenticated: true, loading: false });
      localStorage.setItem("isAuthenticated", "true");
      toast.success("Signup successful");
      return user;
  }catch (err) {
      toast.error(`Signup failed: ${err}`,{duration:3000});
      set({ error: err instanceof Error ? err.message : "An unknown error occurred", loading: false });
    }
  },
  logout: async() =>{
    try{
      set({loading:true,error:null});
      const response = await fetch("http://localhost:5000/api/v1/auth/logout",{
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
