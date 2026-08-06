import { apiClient } from "./client"
import type {
  LoginPayload,
  LoginResponse,
  SignupPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ApiResponse,
  AuthUser,
} from "@/types"

export const authApi = {
  login: (payload: LoginPayload) =>
    apiClient.post<LoginResponse>("/auth/login", payload),

  signup: (payload: SignupPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>("/auth/signup", payload),

  register: (payload: FormData) =>
    apiClient.post<ApiResponse<{ message: string }>>("/auth/register", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  me: () =>
    apiClient.get<ApiResponse<AuthUser>>("/auth/me"),

  forgotPassword: (payload: ForgotPasswordPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", payload),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient.post<ApiResponse<{ message: string }>>("/auth/reset-password", payload),
}
