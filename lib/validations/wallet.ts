import { z } from "zod"

export const topUpSchema = z.object({
  amount: z.number().min(100, "Minimum top-up is $100"),
  paymentMethod: z.string().min(1, "Select a payment method"),
  reference: z.string().optional(),
})

export const budgetAllocationSchema = z.object({
  userId: z.string().min(1, "Select a team member"),
  amount: z.number().min(1, "Amount must be greater than 0"),
})

export type TopUpFormValues = z.infer<typeof topUpSchema>
export type BudgetAllocationFormValues = z.infer<typeof budgetAllocationSchema>
