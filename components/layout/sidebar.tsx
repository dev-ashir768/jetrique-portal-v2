"use client"

import { useState, createElement } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { useSidebarStore, useRBACStore } from "@/stores"
import { useMyMenus } from "@/hooks/use-rbac"
import { getIcon } from "@/lib/icon-map"
import type { MenuItem } from "@/types"

function NavLink({
  item,
  isCollapsed,
  indent = false,
}: {
  item: MenuItem
  isCollapsed: boolean
  indent?: boolean
}) {
  const pathname = usePathname()
  const href = item.path
  if (!href) return null

  const isActive = pathname === href || pathname.startsWith(href + "/")
  const icon = getIcon(item.icon)

  return (
    <Link
      href={href}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
        isCollapsed && "justify-center px-2",
        indent && !isCollapsed && "pl-5 ml-1",
      )}
    >
      {!indent && createElement(icon, { className: "h-4.5 w-4.5 shrink-0" })}
      {!isCollapsed && <span>{item.name}</span>}
    </Link>
  )
}

function NavDropdown({
  item,
  isCollapsed,
}: {
  item: MenuItem
  isCollapsed: boolean
}) {
  const pathname = usePathname()
  const isChildActive = (item.children ?? []).some(
    (child) =>
      child.path &&
      (pathname === child.path || pathname.startsWith(child.path + "/")),
  )
  const [open, setOpen] = useState(isChildActive)
  const icon = getIcon(item.icon)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-9 w-full items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition-colors",
          isChildActive
            ? "text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
          isCollapsed && "justify-center px-2",
        )}
      >
        {createElement(icon, { className: "h-4.5 w-4.5 shrink-0" })}
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.name}</span>
            <ChevronRight
              className={cn(
                "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                open && "rotate-90",
              )}
            />
          </>
        )}
      </button>
      {open && !isCollapsed && (
        <div className="ml-4.5 border-l border-border pl-0 flex flex-col gap-0.5">
          {(item.children ?? []).map((child) => (
            <NavLink key={child.id} item={child} isCollapsed={false} indent />
          ))}
        </div>
      )}
    </div>
  )
}

function NavItem({
  item,
  isCollapsed,
}: {
  item: MenuItem
  isCollapsed: boolean
}) {
  if ((item.children ?? []).length > 0) {
    return <NavDropdown item={item} isCollapsed={isCollapsed} />
  }
  return <NavLink item={item} isCollapsed={isCollapsed} />
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 px-2 py-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full rounded-md" />
      ))}
    </div>
  )
}

function SidebarContent({ isCollapsed }: { isCollapsed: boolean }) {
  const { isLoading } = useMyMenus()
  const { menus } = useRBACStore()

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-tl-2xl bg-sidebar">
      <ScrollArea className="flex-1 px-2 py-3">
        {isLoading ? (
          <SidebarSkeleton />
        ) : (
          <nav className="flex flex-col gap-0.5">
            {menus.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        )}
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
          "hidden flex-col rounded-tl-2xl transition-all duration-300 md:flex",
          isCollapsed ? "w-16" : "w-58",
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
