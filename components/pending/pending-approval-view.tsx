"use client"

import { Clock } from "lucide-react"
import { useAuthStore } from "@/stores"

export function PendingApprovalView() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-lg font-semibold">{user?.organization?.name}</h1>
          <p className="text-sm text-muted-foreground">Application under review</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-950/40">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Application Under Review</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              Your documents have been submitted and are currently being reviewed by our team. You will be notified once your application is approved.
            </p>
          </div>
          <div className="mt-2 rounded-lg border border-yellow-200 bg-yellow-50 px-5 py-3 dark:border-yellow-900 dark:bg-yellow-950/40">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">
              This process typically takes 1–2 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
