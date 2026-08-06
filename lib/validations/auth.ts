import { z } from "zod"

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export const registerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  organizationEmail: z.email("Invalid email address"),
  organizationPhone: z.string().min(7, "Valid phone number is required"),
  organizationPhoneCountry: z.string().min(2, "Country code is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  address: z.string().min(5, "Address is required"),
  cityId: z.string().min(1, "City is required"),
  adminName: z.string().min(2, "Admin name is required"),
  adminEmail: z.email("Invalid email address"),
  adminPassword: z.string().min(8, "Password must be at least 8 characters"),
})


export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email address"),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
