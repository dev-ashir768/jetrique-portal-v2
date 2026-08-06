import { apiClient } from "./client"
import type { PaginationParams, TopUpPayload, BudgetAllocation } from "@/types"

export const walletApi = {
  getMyWallet: () =>
    apiClient.get("/wallet"),

  getTransactions: (params?: PaginationParams) =>
    apiClient.get("/wallet/transactions", { params }),

  topUp: (payload: TopUpPayload) =>
    apiClient.post("/wallet/topup", payload),

  allocateBudget: (payload: BudgetAllocation) =>
    apiClient.post("/wallet/allocate-budget", payload),

  getTeamBudgets: () =>
    apiClient.get("/wallet/team-budgets"),
}

