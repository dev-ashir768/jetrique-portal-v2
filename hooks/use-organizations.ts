"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { organizationsApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/api/client"
import type { OrganizationFilters } from "@/types/organizations"

export function useOperators(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: ["operators", filters],
    queryFn: async () => {
      const { data } = await organizationsApi.getOperators(filters)
      return data.data
    },
  })
}

export function useAgents(filters?: OrganizationFilters) {
  return useQuery({
    queryKey: ["agents", filters],
    queryFn: async () => {
      const { data } = await organizationsApi.getAgents(filters)
      return data.data
    },
  })
}

export function useApproveOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => organizationsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Organization approved")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useRejectOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      organizationsApi.reject(id, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Organization rejected")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useSuspendOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => organizationsApi.suspend(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Organization suspended")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}
