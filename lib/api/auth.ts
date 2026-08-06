import { apiClient } from "./client"
import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types"

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", payload),

  signup: (payload: SignupPayload) =>
    apiClient.post("/auth/register", payload),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post("/auth/forgot-password", payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post("/auth/reset-password", payload),

  verifyEmail: (token: string) =>
    apiClient.post("/auth/verify-email", { token }),

  me: () =>
    apiClient.get("/auth/me"),

  logout: () =>
    apiClient.post("/auth/logout"),
}
