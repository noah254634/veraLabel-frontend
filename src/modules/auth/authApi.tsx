import toast from "react-hot-toast";

const Url = "/api/v1/auth/";
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
      
      if (response.status === 403 || (errorMessage && errorMessage.toLowerCase().includes("verify"))) {
        const verifyMessage = "Email not verified. Please verify your email.";
        toast.error(verifyMessage, { duration: 3000 });
        throw new Error("Email not verified");
      }

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
      // Log server error for debugging but don't expose to user
      const errorMessage =
        errorData?.message || errorData?.error || response.statusText;
      const genericErrorMessage = "Could not create account. Please check your details and try again.";
      toast.error(`Signup failed: ${genericErrorMessage}`, { duration: 3000 });
      throw new Error(genericErrorMessage);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyEmailApi = async (email: string, token: string) => {
  const response = await fetch(`${Url}verifyEmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, token }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || errorData?.error || "Verification failed";
    toast.error(`Verification failed: ${errorMessage}`, { duration: 3000 });
    throw new Error(errorMessage);
  }
  return response;
};

export const resendVerificationApi = async (email: string) => {
  const response = await fetch(`${Url}resend-verification`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || errorData?.error || "Failed to resend code";
    toast.error(`Error: ${errorMessage}`, { duration: 3000 });
    throw new Error(errorMessage);
  }
  return response;
};
