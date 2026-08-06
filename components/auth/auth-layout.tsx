import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
  footer?: ReactNode
  size?: "default" | "wide"
}

export function AuthLayout({ children, title, description, footer, size = "default" }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8" style={{ background: "linear-gradient(175deg, rgb(10, 37, 64) 0%, rgb(10, 74, 140) 22%, rgb(26, 114, 199) 48%, rgb(90, 175, 240) 72%, rgb(200, 232, 250) 88%, rgb(238, 247, 255) 100%)" }}>
      <div className="mb-8 flex flex-col items-center gap-2">
        <Link href="/">
          <Image
            src="/images/branding/logo-light.webp"
            alt="Jetrique"
            width={180}
            height={55}
            priority
          />
        </Link>
      </div>

      <div className={`w-full ${size === "wide" ? "max-w-2xl" : "max-w-[420px]"}`}>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-xl font-semibold tracking-tight text-card-foreground font-heading">
              {title}
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>

        {footer && (
          <div className="mt-4 text-center text-sm text-white/80">
            {footer}
          </div>
        )}
      </div>

      <div className="mt-8 text-xs text-white/90">
        &copy; {new Date().getFullYear()} Jetrique. All rights reserved.
      </div>
    </div>
  )
}
