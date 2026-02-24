import { useAuthStore } from "../../modules/auth/useAuthstore";
import { toast } from "react-hot-toast";
import axios from "axios";
export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    if (error.response?.status === 401) {
      toast.error(`${backendMessage}}`,{duration:9000});
      useAuthStore.getState().logout();
      //window.location.href = "/login";
    }
    else{
      toast.error(`${backendMessage}}`,{duration:9000});
    }
    return Promise.reject(error);
  },
);
