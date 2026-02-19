import toast from "react-hot-toast";

const Url = "http://localhost:5000/api/v1/auth/";
export type LoginCredentials = {
  email: string;
  password: string;
};
export type SignupCredentials = {
  name: string;
  email: string;
  password: string;
};

export const loginApi = async (credentials: LoginCredentials) => {
  try {
    const response = await fetch(`${Url}login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || errorData?.error || response.statusText;
      toast.error(`Login failed: ${errorMessage}`, { duration: 3000 });
      throw new Error(errorMessage);
    }
    
    return response;
  } catch (error) {
    throw error;
  }
};
export const signupApi = async (credentials: SignupCredentials) => {
  try {
    const response = await fetch(`${Url}signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage =
        errorData?.message || errorData?.error || response.statusText;
      toast.error(`Signup failed: ${errorMessage}`, { duration: 3000 });
      throw new Error(errorMessage);
    }
    return response;
  } catch (error) {
    throw error;
  }
};
