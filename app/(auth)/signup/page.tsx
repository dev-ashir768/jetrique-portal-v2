import Link from "next/link"
import { AuthLayout, SignupForm } from "@/components/auth"

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Get started with Jetrique to book private jets and helicopters."
      footer={
        <p>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-white underline hover:text-white/80">
            Log in
          </Link>
        </p>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}
