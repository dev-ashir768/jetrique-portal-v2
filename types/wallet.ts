import type { UUID, Currency, WalletTransactionType, WalletTransactionStatus } from "./common"

export interface Wallet {
  id: UUID
  userId: UUID
  balance: number
  currency: Currency
  updatedAt: string
}

export interface WalletTransaction {
  id: UUID
  walletId: UUID
  type: WalletTransactionType
  amount: number
  status: WalletTransactionStatus
  description: string
  reference: string | null
  createdAt: string
}

export interface TopUpPayload {
  amount: number
  paymentMethod: string
  reference?: string
}

export interface BudgetAllocation {
  userId: UUID
  amount: number
}

export interface WalletBudget {
  id: UUID
  userId: UUID
  userName: string
  allocatedAmount: number
  usedAmount: number
  remainingAmount: number
}
