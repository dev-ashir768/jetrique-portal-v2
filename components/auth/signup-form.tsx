"use client"

import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signupSchema, type SignupFormValues } from "@/lib/validations"
import { useSignup } from "@/hooks/use-auth"

export function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "AGENT",
      organizationName: "",
    },
  })

  const selectedRole = useWatch({
    control,
    name: "role"
  })

  const signup = useSignup(setError)

  const onSubmit = (data: SignupFormValues) => {
    signup.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="firstName">First name</Label>
          <Input
            id="firstName"
            placeholder="John"
            autoFocus
            {...register("firstName")}
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-xs text-destructive">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="lastName">Last name</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register("lastName")}
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-xs text-destructive">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@company.com"
          autoComplete="email"
          {...register("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+92 300 1234567"
          {...register("phone")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Account type</Label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${selectedRole === "OPERATOR"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
              }`}
          >
            <input
              type="radio"
              value="OPERATOR"
              className="sr-only"
              {...register("role")}
            />
            Operator
          </label>
          <label
            className={`flex cursor-pointer items-center justify-center rounded-lg border-2 px-4 py-2.5 text-sm font-medium transition-colors ${selectedRole === "AGENT"
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
              }`}
          >
            <input
              type="radio"
              value="AGENT"
              className="sr-only"
              {...register("role")}
            />
            Agent
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="organizationName">Organization name</Label>
        <Input
          id="organizationName"
          placeholder="Your company name"
          {...register("organizationName")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            className="pr-10"
            {...register("password")}
            aria-invalid={!!errors.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Re-enter password"
            autoComplete="new-password"
            className="pr-10"
            {...register("confirmPassword")}
            aria-invalid={!!errors.confirmPassword}
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-2 w-full"
        disabled={signup.isPending}
      >
        {signup.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </form>
  )
}
