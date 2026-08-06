import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// All possible status values across the app
type StatusValue =
  // Generic boolean
  | boolean
  // OrganizationStatus / UserStatus / WalletTransactionStatus
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  // DocumentStatus
  | "VERIFIED"
  // Active/Inactive string (some APIs return strings)
  | "ACTIVE"
  | "INACTIVE"

const STATUS_STYLES: Record<string, string> = {
  // ── Green ──
  APPROVED:  "bg-green-50 text-green-700 border-green-200",
  VERIFIED:  "bg-green-50 text-green-700 border-green-200",
  ACTIVE:    "bg-green-50 text-green-700 border-green-200",

  // ── Yellow ──
  PENDING:   "bg-yellow-50 text-yellow-700 border-yellow-200",

  // ── Red ──
  REJECTED:  "bg-red-50 text-red-700 border-red-200",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200",
  INACTIVE:  "bg-red-50 text-red-700 border-red-200",
}

const STATUS_LABELS: Record<string, string> = {
  APPROVED:  "Approved",
  VERIFIED:  "Verified",
  ACTIVE:    "Active",
  PENDING:   "Pending",
  REJECTED:  "Rejected",
  SUSPENDED: "Suspended",
  INACTIVE:  "Inactive",
}

interface StatusBadgeProps {
  status: StatusValue
  className?: string
  onClick?: () => void
  disabled?: boolean
}

export function StatusBadge({ status, className, onClick, disabled }: StatusBadgeProps) {
  // Normalize boolean → string key
  const key =
    typeof status === "boolean"
      ? status ? "ACTIVE" : "INACTIVE"
      : status.toUpperCase()

  const styles = STATUS_STYLES[key] ?? "bg-muted text-muted-foreground border-border"
  const label  = STATUS_LABELS[key] ?? key

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-medium",
        styles,
        disabled && "pointer-events-none opacity-50 cursor-not-allowed",
        className,
      )}
      onClick={disabled ? undefined : onClick}
    >
      {label}
    </Badge>
  )
}
