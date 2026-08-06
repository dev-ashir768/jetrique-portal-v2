"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { rbacApi } from "@/lib/api"
import { useRBACStore } from "@/stores"
import type { MenusParams } from "@/types"

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

export function useToggleMenuActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      rbacApi.toggleMenuActive(id, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-menus"] }),
  })
}
