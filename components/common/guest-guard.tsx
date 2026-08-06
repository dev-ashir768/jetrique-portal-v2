"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores"

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) return null

  if (isAuthenticated) return null

  return <>{children}</>
}
