import { AuthLayout, ForgotPasswordForm } from "@/components/auth"

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email associated with your account and we'll send a reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  )
}
