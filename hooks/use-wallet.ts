"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { walletApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/api/client"
import type { TopUpPayload, BudgetAllocation, PaginationParams } from "@/types"

export function useWallet() {
  return useQuery({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data } = await walletApi.getMyWallet()
      return data.data
    },
  })
}

export function useWalletTransactions(params?: PaginationParams) {
  return useQuery({
    queryKey: ["wallet-transactions", params],
    queryFn: async () => {
      const { data } = await walletApi.getTransactions(params)
      return data
    },
  })
}

export function useTopUp() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: TopUpPayload) => walletApi.topUp(payload),
    onSuccess: () => {
      toast.success("Top-up request submitted")
      qc.invalidateQueries({ queryKey: ["wallet"] })
      qc.invalidateQueries({ queryKey: ["wallet-transactions"] })
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useAllocateBudget() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: BudgetAllocation) => walletApi.allocateBudget(payload),
    onSuccess: () => {
      toast.success("Budget allocated successfully")
      qc.invalidateQueries({ queryKey: ["wallet"] })
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Budget allocation failed")
    },
  })
}

export function useTeamBudgets() {
  return useQuery({
    queryKey: ["team-budgets"],
    queryFn: async () => {
      const { data } = await walletApi.getTeamBudgets()
      return data.data
    },
  })
}
