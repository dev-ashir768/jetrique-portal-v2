import type { ReactNode } from "react"
import { AuthGuard } from "@/components/common"
import { Header } from "@/components/layout"
import { Sidebar } from "@/components/layout"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden bg-topbar">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-content rounded-tr-xl p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
