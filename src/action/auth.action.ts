import { registerUser, loginUser } from "@/api/auth.api";

interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

export const handleRegister = async (
  data: { email: string; username: string; password: string }
): Promise<ActionResponse> => {
  try {
    const res = await registerUser(data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Registration failed",
    };
  }
};

export const handleLogin = async (
  data: { identifier: string; password: string }
): Promise<ActionResponse> => {
  try {
    const res = await loginUser(data);
    return { success: true, data: res.data };
  } catch (err: any) {
    return {
      success: false,
      message: err.response?.data?.message || "Login failed",
    };
  }
};
