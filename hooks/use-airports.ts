"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { airportsApi } from "@/lib/api"
import { getErrorMessage } from "@/lib/api/client"
import type { AirportFilters, CreateAirportPayload, UpdateAirportPayload } from "@/types/airports"

export function useAirports(filters?: AirportFilters) {
  return useQuery({
    queryKey: ["airports", filters],
    queryFn: async () => {
      const { data } = await airportsApi.getAll(filters)
      return data.data
    },
  })
}

export function useAirport(id: string) {
  return useQuery({
    queryKey: ["airport", id],
    queryFn: async () => {
      const { data } = await airportsApi.getById(id)
      return data.data
    },
    enabled: !!id,
  })
}

export function useCreateAirport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAirportPayload) => airportsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airports"] })
      toast.success("Airport created successfully")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateAirport(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateAirportPayload) => airportsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airports"] })
      queryClient.invalidateQueries({ queryKey: ["airport", id] })
      toast.success("Airport updated successfully")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useSetAirportActive(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (isActive: boolean) => airportsApi.setActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["airports"] })
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}
