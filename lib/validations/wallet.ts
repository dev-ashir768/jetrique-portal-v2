import { z } from "zod"

export const topUpSchema = z.object({
  amount: z.number({ error: "Enter a valid amount" }).min(1, "Amount is required"),
  reference: z.string().trim().optional(),
  remarks: z.string().trim().optional(),
  proof: z.instanceof(File, { message: "Payment proof is required" }),
})

export const budgetAllocationSchema = z.object({
  userId: z.string().min(1, "Select a team member"),
  amount: z.number().min(1, "Amount must be greater than 0"),
})

export type TopUpFormValues = z.infer<typeof topUpSchema>
export type BudgetAllocationFormValues = z.infer<typeof budgetAllocationSchema>
