import { z } from "zod"
import { isValidPhoneNumber } from "libphonenumber-js"

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

// Dynamic schema — countryCode comes from the country dropdown selection
export function makeRegisterSchema(countryCode: string | null) {
  return z.object({
    organizationName: z.string().trim().min(2, "Organization name is required"),
    organizationEmail: z.string().trim().email("Invalid email address"),
    organizationPhone: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .refine(
        (val) => {
          if (!countryCode) return val.length >= 7
          try {
            return isValidPhoneNumber(val, countryCode as Parameters<typeof isValidPhoneNumber>[1])
          } catch {
            return false
          }
        },
        { message: countryCode ? `Invalid phone number for ${countryCode}` : "Invalid phone number" }
      ),
    countryId: z.string().min(1, "Country is required"),
    provinceId: z.string().min(1, "Province is required"),
    cityId: z.string().min(1, "City is required"),
    registrationNumber: z.string().trim().min(1, "Registration number is required"),
    address: z.string().trim().min(5, "Address is required"),
    adminName: z.string().trim().min(2, "Admin name is required"),
    adminEmail: z.string().trim().email("Invalid email address"),
    adminPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
}

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<ReturnType<typeof makeRegisterSchema>>
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>
