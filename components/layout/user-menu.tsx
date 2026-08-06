"use client"

import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { useAuthStore } from "@/stores"
import { useLogout } from "@/hooks/use-auth"
import { ROUTES } from "@/config/routes"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button"
import { Separator } from "@/components/ui/separator"

export function UserMenu() {
  const { user } = useAuthStore()
  const logout = useLogout()

  const initials = user
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="px-0"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-topbar-foreground text-xs font-medium text-topbar">
            {initials}
          </div>
          <span className="hidden truncate text-left text-sm text-topbar-foreground/80 md:block">{user?.name}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-1.5 w-48 gap-1 rounded-md" align="end">
        {user && (
          <>
            <div className="px-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            <Separator className="mt-1 absolute inset-x-0"/>
            </div>
          </>
        )}
        <div className="flex flex-col pt-1.5">
          <Link
            href={ROUTES.DASHBOARD.SETTINGS.PROFILE}
            className="flex items-center gap-2 rounded-lg px-1.5 h-9 text-sm transition-colors hover:bg-accent"
          >
            <User className="size-4" /> Profile
          </Link>
          <Link
            href={ROUTES.DASHBOARD.SETTINGS.ROOT}
            className="flex items-center gap-2 rounded-lg px-1.5 h-9 text-sm transition-colors hover:bg-accent"
          >
            <Settings className="size-4" /> Settings
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-1.5 h-9 text-sm text-destructive transition-colors hover:bg-accent"
          >
            <LogOut className="size-4" /> Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
