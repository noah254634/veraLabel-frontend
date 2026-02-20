import { create } from "zustand";
import type { User } from "../../shared/types/user";
import { loginApi,signupApi, type LoginCredentials,type SignupCredentials} from "./authApi";
import {toast} from "react-hot-toast";
type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  setUser: (user: User) => void;
  logout: () => void;
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

  login: async (credentials) => {
    try {
      set({ loading: true, error: null });
      const response = await loginApi(credentials);
      const data = await response.json();
      const user = data.user;
      set({ user, isAuthenticated: true, loading: false });
      console.log(user);
      console.log(data.message);
      console.log(response);
      toast.success("Login successful");
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
      const user = await response.json();
      set({ user, isAuthenticated: true, loading: false });
      toast.success("Signup successful");
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
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "An unknown error occurred", loading: false });
    }
  },
}));

