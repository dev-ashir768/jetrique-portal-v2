"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore, useRBACStore } from "@/stores"
import { useMyMenus } from "@/hooks/use-rbac"
import { Spinner } from "@/components/ui/spinner"
import type { MenuItem } from "@/types"

const PUBLIC_ROUTES = ["/dashboard"]

function getAllPaths(menus: MenuItem[]): string[] {
  const paths: string[] = []
  for (const menu of menus) {
    if (menu.path) paths.push(menu.path)
    if (menu.children?.length) paths.push(...getAllPaths(menu.children))
  }
  return paths
}

function isRouteAllowed(pathname: string, menus: MenuItem[]): boolean {
  if (PUBLIC_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
    return true
  }
  const allowedPaths = getAllPaths(menus)
  return allowedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + "/"),
  )
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const menus = useRBACStore((s) => s.menus)
  const router = useRouter()
  const pathname = usePathname()
  const { isLoading } = useMyMenus()
  const [hydrated, setHydrated] = useState(() =>
    typeof window !== "undefined" && useAuthStore.persist.hasHydrated()
  )

  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    return unsub
  }, [])

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, router])

  useEffect(() => {
    if (hydrated && isAuthenticated && !isLoading && menus.length > 0) {
      if (!isRouteAllowed(pathname, menus)) {
        router.replace("/dashboard")
      }
    }
  }, [hydrated, isAuthenticated, isLoading, menus, pathname, router])

  if (!hydrated || isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  if (menus.length > 0 && !isRouteAllowed(pathname, menus)) return null

  return <>{children}</>
}
