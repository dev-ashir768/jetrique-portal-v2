"use client"

import { Wallet, TrendingUp, ArrowDownLeft } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/common/page-header"
import { TopUpDialog } from "./top-up-dialog"

function fmt(value: string, currency: string) {
  return `${currency} ${Number(value).toLocaleString("en-PK", { minimumFractionDigits: 2 })}`
}

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
}: {
  label: string
  value: string
  icon: React.ElementType
  loading: boolean
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-7 w-36" />
      ) : (
        <span className="text-2xl font-bold tracking-tight">{value}</span>
      )}
    </div>
  )
}

export function MyWalletView() {
  const { data: wallet, isLoading } = useWallet()

  const currency = wallet?.currency ?? "PKR"

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="My Wallet" description="Your balance and budget allocation overview">
        <TopUpDialog />
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Balance"
          value={wallet ? fmt(wallet.balance, currency) : "—"}
          icon={Wallet}
          loading={isLoading}
        />
        <StatCard
          label="Allocated (Remaining)"
          value={wallet ? fmt(wallet.allocation.totalAllocatedRemaining, currency) : "—"}
          icon={ArrowDownLeft}
          loading={isLoading}
        />
        <StatCard
          label="Available to Allocate"
          value={wallet ? fmt(wallet.allocation.availableToAllocate, currency) : "—"}
          icon={TrendingUp}
          loading={isLoading}
        />
      </div>
    </div>
  )
}
