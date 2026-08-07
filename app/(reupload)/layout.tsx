import type { ReactNode } from "react"
import { ReuploadGuard } from "@/components/common/reupload-guard"

export default function ReuploadLayout({ children }: { children: ReactNode }) {
  return <ReuploadGuard>{children}</ReuploadGuard>
}
