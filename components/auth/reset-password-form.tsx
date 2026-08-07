"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validations"
import { authApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/api/client"

interface Props {
  token: string
}

export function ResetPasswordForm({ token }: Props) {
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      authApi.resetPassword({ token, password: data.password, confirmPassword: data.confirmPassword }),
    onSuccess: () => setDone(true),
    onError: (error: unknown) => toast.error(getErrorMessage(error)),
  })

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-destructive">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
          Request a new link
        </Link>
      </div>
    )
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-card-foreground">Password reset successfully</p>
          <p className="mt-1 text-sm text-muted-foreground">You can now log in with your new password.</p>
        </div>
        <Link href="/login">
          <Button className="mt-2 w-full">Go to Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Min. 8 characters"
          autoComplete="new-password"
          autoFocus
          {...register("password")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="mt-2 w-full" disabled={mutation.isPending}>
        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Reset Password
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
