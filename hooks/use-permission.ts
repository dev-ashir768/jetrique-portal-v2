"use client"

import { useRBACStore } from "@/stores"

export function usePermission(menuSlug: string, permissionSlug: string): boolean {
  return useRBACStore((s) => s.hasPermission(menuSlug, permissionSlug))
}

export function usePermissions(menuSlug: string, permissionSlugs: string[]): Record<string, boolean> {
  const hasPermission = useRBACStore((s) => s.hasPermission)
  const result: Record<string, boolean> = {}
  for (const slug of permissionSlugs) {
    result[slug] = hasPermission(menuSlug, slug)
  }
  return result
}
