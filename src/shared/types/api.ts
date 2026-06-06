import { useAuthStore } from "../../modules/auth/useAuthstore";
import axios from "axios";
import { getApiBaseUrl } from "../utils/apiUrl";
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (localStorage.getItem("isAuthenticated") === "true") {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);
