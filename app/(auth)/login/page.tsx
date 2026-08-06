import Link from "next/link"
import { AuthLayout, LoginForm } from "@/components/auth"

export default function LoginPage() {
  return (
    <AuthLayout
      title="Log in to Jetrique"
      description="Enter your credentials to access your account."
      footer={
        <p>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-white underline hover:text-white/80">
            Create account
          </Link>
        </p>
      }
    >
      <LoginForm />
    </AuthLayout>
  )
}
