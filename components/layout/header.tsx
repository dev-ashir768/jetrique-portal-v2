"use client"

import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { UserMenu } from "./user-menu"
import { useEffect, useState } from "react"
import { Kbd, KbdGroup } from "../ui/kbd"
import { useSidebarStore } from "@/stores"

function HamburgerButton() {
  const { isCollapsed, toggle, setMobileOpen } = useSidebarStore()

  return (
    <>
      {/* Desktop: toggle collapse */}
      <button
        onClick={toggle}
        aria-label="Toggle sidebar"
        className="mr-3 hidden md:flex h-8 w-8 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-topbar-accent transition-colors"
      >
        <span
          className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80 transition-all duration-300 origin-center"
          style={isCollapsed ? { transform: "translateY(8px) rotate(45deg)" } : {}}
        />
        <span
          className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80 transition-all duration-300"
          style={isCollapsed ? { opacity: 0, transform: "scaleX(0)" } : {}}
        />
        <span
          className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80 transition-all duration-300 origin-center"
          style={isCollapsed ? { transform: "translateY(-8px) rotate(-45deg)" } : {}}
        />
      </button>
      {/* Mobile: open sheet */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
        className="mr-3 flex md:hidden h-8 w-8 shrink-0 flex-col items-center justify-center gap-1.5 rounded-md hover:bg-topbar-accent transition-colors"
      >
        <span className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80" />
        <span className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80" />
        <span className="block h-0.5 w-5 rounded-full bg-topbar-foreground/80" />
      </button>
    </>
  )
}

export function Header() {
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    const isMacOs = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(isMacOs)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center bg-topbar px-4">
      <HamburgerButton />
      <Link href="/dashboard" className="mr-6 shrink-0">
        <Image
          src="/images/branding/logo-light.webp"
          alt="Jetrique"
          width={110}
          height={34}
          priority
        />
      </Link>

      <div className="mx-auto flex max-w-xl flex-1 justify-center">
        <button className="flex w-full items-center gap-2 rounded-md bg-topbar-accent px-4 py-1.5 text-sm text-topbar-foreground/70 transition-colors hover:bg-topbar-muted">
          <Search className="h-4 w-4" />
          <span>Search</span>
          <KbdGroup className="ml-auto hidden md:inline-flex ">
            <Kbd className="border border-topbar-foreground/20 bg-topbar-accent ont-medium text-topbar-foreground/60">{isMac ? "⌘" : "Ctrl"}</Kbd>
            <span>+</span>
            <Kbd className="border border-topbar-foreground/20 bg-topbar-accent ont-medium text-topbar-foreground/60">K</Kbd>
          </KbdGroup>
        </button>
      </div>

      <UserMenu />
    </header>
  )
}
