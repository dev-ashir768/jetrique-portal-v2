"use client"

import { useQuery } from "@tanstack/react-query"
import { rbacApi } from "@/lib/api"
import { useRBACStore } from "@/stores"

export function useMyMenus() {
  const { setMenus } = useRBACStore()

  return useQuery({
    queryKey: ["rbac", "my-menus"],
    queryFn: async () => {
      const { data } = await rbacApi.getMyMenus()
      setMenus(data.data)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}
