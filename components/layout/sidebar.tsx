"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useSidebarStore } from "@/stores"
import { useAuthStore } from "@/stores"
import { DASHBOARD_NAV, ADMIN_NAV } from "@/config/navigation"
import type { NavItem } from "@/config/navigation"

function NavLink({ item, isCollapsed }: { item: NavItem; isCollapsed: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === item.href

  return (
    <Link
      href={item.href}
      className={cn(
        "flex h-10 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
        isCollapsed && "justify-center px-2",
      )}
    >
      <item.icon className="h-4.5 w-4.5 shrink-0" />
      {!isCollapsed && <span>{item.title}</span>}
    </Link>
  )
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { user } = useAuthStore()
  const isSuperAdmin = user?.role === "Super Admin"

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-tl-xl bg-sidebar">
      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="flex flex-col gap-0.5">
          {DASHBOARD_NAV.map((item) => (
            <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
          ))}

          {isSuperAdmin && (
            <>
              <div className={cn("my-3 border-t", isCollapsed && "mx-2")} />
              {!isCollapsed && (
                <span className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                  Admin
                </span>
              )}
              {ADMIN_NAV.map((item) => (
                <NavLink key={item.href} item={item} isCollapsed={isCollapsed} />
              ))}
            </>
          )}
        </nav>
      </ScrollArea>
    </div>
  )
}

export function Sidebar() {
  const { isCollapsed, isMobileOpen, setMobileOpen } = useSidebarStore()

  return (
    <>
      <aside
        className={cn(
          "hidden flex-col rounded-tl-xl transition-all duration-300 md:flex",
          isCollapsed ? "w-16" : "w-55",
        )}
      >
        <SidebarContent isCollapsed={isCollapsed} />
      </aside>

      <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-55 border-0 p-0">
          <SidebarContent isCollapsed={false} />
        </SheetContent>
      </Sheet>
    </>
  )
}
