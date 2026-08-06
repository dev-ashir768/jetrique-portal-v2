"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
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

  // Kick off menu fetch. Only redirect AFTER this resolves (isSuccess) so we
  // never redirect based on stale/partial localStorage data.
  const { isLoading: menusLoading, isSuccess: menusLoaded } = useMyMenus()

  // Track auth store hydration
  const [authHydrated, setAuthHydrated] = useState(
    () => typeof window !== "undefined" && useAuthStore.persist.hasHydrated(),
  )
  useEffect(() => {
    if (useAuthStore.persist.hasHydrated()) {
      setAuthHydrated(true)
      return
    }
    const unsub = useAuthStore.persist.onFinishHydration(() => setAuthHydrated(true))
    return unsub
  }, [])

  // Track RBAC store hydration
  const [rbacHydrated, setRbacHydrated] = useState(
    () => typeof window !== "undefined" && useRBACStore.persist.hasHydrated(),
  )
  useEffect(() => {
    if (useRBACStore.persist.hasHydrated()) {
      setRbacHydrated(true)
      return
    }
    const unsub = useRBACStore.persist.onFinishHydration(() => setRbacHydrated(true))
    return unsub
  }, [])

  const hydrated = authHydrated && rbacHydrated

  // Redirect to login
  useEffect(() => {
    if (authHydrated && !isAuthenticated) {
      router.replace("/login")
    }
  }, [authHydrated, isAuthenticated, router])

  // Redirect to dashboard ONLY after menus have been freshly fetched from the API.
  // This prevents a stale-localStorage check from wrongly kicking the user out.
  useEffect(() => {
    if (!hydrated || !isAuthenticated) return
    if (!menusLoaded) return            // wait for API, not just localStorage
    if (!isRouteAllowed(pathname, menus)) {
      router.replace("/dashboard")
    }
  }, [hydrated, isAuthenticated, menusLoaded, menus, pathname, router])

  // Show skeleton/spinner until both stores are hydrated and menus are loading
  const ready = hydrated && (menusLoaded || menus.length > 0)

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  // While menus are still fetching on refresh, use localStorage copy for optimistic render.
  // If that copy says the route is blocked, wait for the real fetch before deciding.
  if (menusLoaded && !isRouteAllowed(pathname, menus)) return null

  return <>{children}</>
}
