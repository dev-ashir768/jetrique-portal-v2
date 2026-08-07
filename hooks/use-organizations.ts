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

export function useOrganization(id: string) {
  return useQuery({
    queryKey: ["organization", id],
    queryFn: async () => {
      const { data } = await organizationsApi.getById(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useOrganizationDocuments(id: string) {
  return useQuery({
    queryKey: ["organization-documents", id],
    queryFn: async () => {
      const { data } = await organizationsApi.getDocuments(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useVerifyDocument(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (docId: string) => organizationsApi.verifyDocument(orgId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-documents", orgId] })
      toast.success("Document verified")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useRejectDocument(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ docId, remarks }: { docId: string; remarks: string }) =>
      organizationsApi.rejectDocument(orgId, docId, remarks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-documents", orgId] })
      toast.success("Document rejected")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useApproveOrganization() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, commissionRate }: { id: string; commissionRate?: number }) =>
      organizationsApi.approve(id, commissionRate !== undefined ? { commissionRate } : undefined),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] })
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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] })
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
    mutationFn: ({ id, remarks }: { id: string; remarks: string }) =>
      organizationsApi.suspend(id, remarks),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["organization", id] })
      queryClient.invalidateQueries({ queryKey: ["operators"] })
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast.success("Organization suspended")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useReuploadOrgDocument(orgId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ docId, file }: { docId: string; file: File }) =>
      organizationsApi.reuploadDocument(orgId, docId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization-documents", orgId] })
      toast.success("Document uploaded successfully")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useMyOrgDocuments() {
  return useQuery({
    queryKey: ["my-org-documents"],
    queryFn: async () => {
      const { data } = await organizationsApi.getMyDocuments()
      return data.data
    },
  })
}
