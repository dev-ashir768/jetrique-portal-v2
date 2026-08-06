"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { rbacApi } from "@/lib/api"
import { useRBACStore } from "@/stores"
import type { MenusParams, CreateMenuPayload } from "@/types"

export function useMyMenus() {
  const { setMenus } = useRBACStore()

  return useQuery({
    queryKey: ["rbac", "my-menus"],
    queryFn: async () => {
      const { data } = await rbacApi.getMyMenus()
      setMenus(data.data)
      return data.data
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useAllMenus(params?: MenusParams) {
  return useQuery({
    queryKey: ["rbac", "all-menus", params],
    queryFn: async () => {
      const { data } = await rbacApi.getMenus(params)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMenuPayload) => rbacApi.createMenu(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-menus"] }),
  })
}

export function useToggleMenuActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      rbacApi.toggleMenuActive(id, isActive),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rbac", "all-menus"] })
    },
  })
}
