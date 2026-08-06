"use client"

import type { ReactNode } from "react"
import { usePermission } from "@/hooks/use-permission"

interface CanProps {
  menu: string
  permission: string
  children: ReactNode
  fallback?: ReactNode
}

export function Can({ menu, permission, children, fallback = null }: CanProps) {
  const allowed = usePermission(menu, permission)
  return allowed ? <>{children}</> : <>{fallback}</>
}
