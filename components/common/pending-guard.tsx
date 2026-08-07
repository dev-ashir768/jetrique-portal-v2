"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores"
import { Spinner } from "@/components/ui/spinner"

export function PendingGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const check = () => {
      if (useAuthStore.persist?.hasHydrated?.() ?? true) setHydrated(true)
    }
    check()
    const unsub = useAuthStore.persist?.onFinishHydration?.(check)
    return () => unsub?.()
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!isAuthenticated) { router.replace("/login"); return }
    const orgStatus = user?.organization?.status
    if (orgStatus === "REJECTED") router.replace("/reupload-documents")
    else if (orgStatus !== "PENDING") router.replace("/dashboard")
  }, [hydrated, isAuthenticated, user, router])

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (!isAuthenticated || user?.organization?.status !== "PENDING") return null

  return <>{children}</>
}
