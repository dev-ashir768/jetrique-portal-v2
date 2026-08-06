"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations"
import { authApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/api/client"

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormValues) => authApi.forgotPassword(data),
    onSuccess: () => {
      setSent(true)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error))
    },
  })

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate(data)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-card-foreground">Check your email</p>
          <p className="mt-1 text-sm text-muted-foreground">
            We sent a password reset link to<br />
            <span className="font-medium text-card-foreground">{getValues("email")}</span>
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setSent(false)}
        >
          Try a different email
        </Button>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to log in
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          autoFocus
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="mt-2 w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Send reset link
      </Button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to log in
        </Link>
      </div>
    </form>
  )
}
