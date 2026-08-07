import { Suspense } from "react"
import { AuthLayout, ResetPasswordForm } from "@/components/auth"
import { ResetPasswordPageClient } from "./client"

export default function ResetPasswordPage() {
  return (
    <AuthLayout
      title="Set new password"
      description="Enter your new password below."
    >
      <Suspense fallback={null}>
        <ResetPasswordPageClient />
      </Suspense>
    </AuthLayout>
  )
}
