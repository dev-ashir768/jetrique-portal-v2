export interface TopUpPayload {
  amount: number
  paymentMethod: string
  reference?: string
}

export interface BudgetAllocation {
  userId: string
  amount: number
}
