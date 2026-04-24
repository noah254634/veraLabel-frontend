import { useAuthStore } from "../../modules/auth/useAuthstore";
import { toast } from "react-hot-toast";
import axios from "axios";
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't show error message directly - it's handled by route-specific error handlers
    if (error.response?.status === 401) {
      // Only show error and logout if user explicitly was authenticated
      if (localStorage.getItem("isAuthenticated") === "true") {
        // Don't toast here - let the component handle it
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);
