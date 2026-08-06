import { Badge } from "@/components/ui/badge"

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  APPROVED: "default",
  VERIFIED: "default",
  ACTIVE: "default",
  PENDING: "secondary",
  REJECTED: "destructive",
  SUSPENDED: "destructive",
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = STATUS_VARIANTS[status] ?? "outline"
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())

  return <Badge variant={variant}>{label}</Badge>
}
