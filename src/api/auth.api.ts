import api from "@/lib/axios";

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export const registerUser = (data: RegisterPayload) =>
  api.post("/auth/register", data);

export const loginUser = (data: LoginPayload) =>
  api.post("/auth/login", data);
