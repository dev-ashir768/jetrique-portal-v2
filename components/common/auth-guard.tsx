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

function normalizePath(p: string) {
  return p.endsWith("/") ? p.slice(0, -1) : p
}

function isRouteAllowed(pathname: string, menus: MenuItem[]): boolean {
  const np = normalizePath(pathname)
  if (PUBLIC_ROUTES.some((r) => np === normalizePath(r) || np.startsWith(normalizePath(r) + "/"))) {
    return true
  }
  return getAllPaths(menus)
    .map(normalizePath)
    .some((p) => np === p || np.startsWith(p + "/"))
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const menus = useRBACStore((s) => s.menus)
  const router = useRouter()
  const pathname = usePathname()

  const { isLoading: menusLoading, isSuccess: menusReady } = useMyMenus()

  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const checkHydration = () => {
      const authReady = useAuthStore.persist?.hasHydrated?.() ?? true
      const rbacReady = useRBACStore.persist?.hasHydrated?.() ?? true
      if (authReady && rbacReady) {
        setHydrated(true)
      }
    }

    checkHydration()

    if (!hydrated) {
      const unsub1 = useAuthStore.persist?.onFinishHydration?.(() => checkHydration())
      const unsub2 = useRBACStore.persist?.onFinishHydration?.(() => checkHydration())
      return () => { unsub1?.(); unsub2?.() }
    }
  }, [hydrated])

  // Redirect to login
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [hydrated, isAuthenticated, router])

  // Only check route permission AFTER fresh menus are fetched from API.
  // Never redirect based on stale localStorage — that causes the refresh-redirect bug.
  useEffect(() => {
    if (!hydrated || !isAuthenticated || !menusReady) return
    const paths = getAllPaths(menus).map(normalizePath)
    const allowed = isRouteAllowed(pathname, menus)
    // eslint-disable-next-line no-console
    console.debug("[AuthGuard] route check", { pathname, allowed, paths })
    if (menus.length > 0 && !allowed) {
      router.replace("/dashboard")
    }
  }, [hydrated, isAuthenticated, menusReady, menus, pathname, router])

  if (!hydrated || (!menusReady && menus.length === 0)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  // Render children optimistically using localStorage menus while API fetch is in-flight.
  // Only block rendering after API confirms route is disallowed.
  if (menusReady && menus.length > 0 && !isRouteAllowed(pathname, menus)) return null

  return <>{children}</>
}
