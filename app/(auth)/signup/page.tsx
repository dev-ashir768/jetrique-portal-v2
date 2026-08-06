import Link from "next/link"
import { AuthLayout, RegisterForm } from "@/components/auth"

export default function SignupPage() {
  return (
    <AuthLayout
      size="wide"
      title="Create your account"
      description="Get started with Jetrique."
      footer={<p>Already have an account? <Link href="/login" className="font-medium text-white underline">Log in</Link></p>}
    >
      <RegisterForm />
    </AuthLayout>
  )
}
