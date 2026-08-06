"use client"

import type { ReactNode } from "react"
import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "sonner"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <Toaster richColors position="bottom-center" />
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}
