"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { authApi } from "@/lib/api"
import { getErrorMessage, getFieldErrors } from "@/lib/api/client"
import { useAuthStore } from "@/stores"
import type { LoginPayload, SignupPayload } from "@/types"
import type { UseFormSetError } from "react-hook-form"

export function useLogin(setError?: UseFormSetError<any>) {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.token)
      toast.success(data.message)
      router.push("/dashboard")
    },
    onError: (error: any) => {
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors && setError) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as any, { message })
        })
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })
}

export function useSignup(setError?: UseFormSetError<any>) {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: ({ data }) => {
      toast.success(data.data?.message ?? "Account created successfully")
      router.push("/login")
    },
    onError: (error: any) => {
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors && setError) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as any, { message })
        })
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })
}

export function useCurrentUser() {
  const { setUser } = useAuthStore()

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await authApi.me()
      setUser(data.data)
      return data.data
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const { logout } = useAuthStore()
  const router = useRouter()

  return () => {
    logout()
    router.push("/login")
  }
}
