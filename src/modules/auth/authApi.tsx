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
      // Log the specific error for internal debugging, but don't expose it to the user.
      console.error("Login API error:", errorMessage);
      const genericErrorMessage = "Invalid credentials provided.";
      toast.error(`Login failed: ${genericErrorMessage}`, { duration: 3000 });
      throw new Error(genericErrorMessage);
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
      // Log the specific error for internal debugging.
      console.error("Signup API error:", errorMessage);
      const genericErrorMessage = "Could not create account. Please check your details and try again.";
      toast.error(`Signup failed: ${genericErrorMessage}`, { duration: 3000 });
      throw new Error(genericErrorMessage);
    }
    return response;
  } catch (error) {
    throw error;
  }
};
