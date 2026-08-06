"use client"

import { useQuery } from "@tanstack/react-query"
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

export function useMenus(params?: MenusParams) {
  return useQuery({
    queryKey: ["rbac", "menus", params],
    queryFn: async () => {
      const { data } = await rbacApi.getMenus(params)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
