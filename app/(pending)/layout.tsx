import { PendingGuard } from "@/components/common/pending-guard"

export default function PendingLayout({ children }: { children: React.ReactNode }) {
  return <PendingGuard>{children}</PendingGuard>
}
