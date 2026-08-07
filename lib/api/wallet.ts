import { apiClient } from "./client"
import type { ApiResponse, PaginationParams, TopUpPayload, BudgetAllocation, Wallet } from "@/types"

export const walletApi = {
  getMyWallet: () =>
    apiClient.get<ApiResponse<Wallet>>("/wallet/my-wallet"),

  getTransactions: (params?: PaginationParams) =>
    apiClient.get("/wallet/transactions", { params }),

  topUp: (payload: TopUpPayload) => {
    const form = new FormData()
    form.append("amount", String(payload.amount))
    if (payload.reference) form.append("reference", payload.reference)
    if (payload.remarks) form.append("remarks", payload.remarks)
    form.append("proof", payload.proof)
    return apiClient.post<ApiResponse<null>>("/wallet/top-up", form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  },

  allocateBudget: (payload: BudgetAllocation) =>
    apiClient.post("/wallet/allocate-budget", payload),

  getTeamBudgets: () =>
    apiClient.get("/wallet/team-budgets"),
}

