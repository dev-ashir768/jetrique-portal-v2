import { z } from "zod"

export const createUserSchema = z.object({
  email: z.email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  role: z.enum(["SUPER_ADMIN", "ORG_ADMIN", "OPERATOR", "AGENT", "USER"]),
})

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
})

export const commissionSchema = z.object({
  commission: z.number().min(0).max(100, "Commission must be between 0-100%"),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
export type ProfileFormValues = z.infer<typeof profileSchema>
export type CommissionFormValues = z.infer<typeof commissionSchema>
