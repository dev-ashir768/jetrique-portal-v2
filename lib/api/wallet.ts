import { apiClient } from "./client"
import type { TopUpPayload, BudgetAllocation, PaginationParams } from "@/types"

export const walletApi = {
  getMyWallet: () =>
    apiClient.get("/wallet"),

  topUp: (payload: TopUpPayload) =>
    apiClient.post("/wallet/top-up", payload),

  getTransactions: (params?: PaginationParams) =>
    apiClient.get("/wallet/transactions", { params }),

  getPendingTopUps: (params?: PaginationParams) =>
    apiClient.get("/wallet/top-ups/pending", { params }),

  approveTopUp: (id: string) =>
    apiClient.patch(`/wallet/top-ups/${id}/approve`),

  rejectTopUp: (id: string) =>
    apiClient.patch(`/wallet/top-ups/${id}/reject`),

  getTeamBudgets: () =>
    apiClient.get("/wallet/budgets"),

  allocateBudget: (payload: BudgetAllocation) =>
    apiClient.patch(`/wallet/budgets/${payload.userId}`, { amount: payload.amount }),
}
