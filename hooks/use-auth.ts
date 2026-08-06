"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { FieldPath, FieldValues, UseFormSetError } from "react-hook-form"
import { authApi } from "@/lib/api"
import { getErrorMessage, getFieldErrors } from "@/lib/api/client"
import { useAuthStore } from "@/stores"
import type { LoginPayload, SignupPayload } from "@/types"
import type { LoginFormValues } from "@/lib/validations/auth"

export function useLogin(setError?: UseFormSetError<LoginFormValues>) {
  const { setAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ data }) => {
      setAuth(data.data.user, data.data.token)
      toast.success(data.message)
      router.push("/dashboard")
    },
    onError: (error: Error) => {
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors && setError) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as FieldPath<LoginFormValues>, { message })
        })
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })
}

export function useSignup<TFieldValues extends FieldValues>(
  setError?: UseFormSetError<TFieldValues>
) {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: SignupPayload) => authApi.signup(payload),
    onSuccess: ({ data }) => {
      toast.success(data.data?.message ?? "Account created successfully")
      router.push("/login")
    },
    onError: (error: Error) => {
      const fieldErrors = getFieldErrors(error)
      if (fieldErrors && setError) {
        Object.entries(fieldErrors).forEach(([field, message]) => {
          setError(field as FieldPath<TFieldValues>, { message })
        })
      } else {
        toast.error(getErrorMessage(error))
      }
    },
  })
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationFn: (payload: FormData) => authApi.register(payload),
    onSuccess: () => {
      router.push("/login")
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error))
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
