export interface WalletAllocation {
  totalAllocatedRemaining: string
  availableToAllocate: string
}

export interface Wallet {
  id: string
  balance: string
  currency: string
  allocation: WalletAllocation
}

export interface TopUpPayload {
  amount: number
  proof: File
  reference?: string
  remarks?: string
}

export interface BudgetAllocation {
  userId: string
  amount: number
}
