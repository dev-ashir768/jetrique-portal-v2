"use client"

import { useSearchParams } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth"

export function ResetPasswordPageClient() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  return <ResetPasswordForm token={token} />
}
