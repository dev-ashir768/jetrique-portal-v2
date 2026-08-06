import axios from "axios"
import { env } from "@/config/env"
import { TOKEN_KEY } from "@/lib/constants"
import type { ApiError } from "@/types"

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

export function getErrorMessage(error: unknown): string {
  const data = (error as { response?: { data?: ApiError } })?.response?.data
  if (data?.message) return data.message
  return "Something went wrong"
}

export function getFieldErrors(error: unknown): Record<string, string> | undefined {
  const data = (error as { response?: { data?: ApiError } })?.response?.data
  return data?.errors
}
