"use client"

import Image from "next/image"
import Link from "next/link"
import { Search } from "lucide-react"
import { UserMenu } from "./user-menu"
import { useEffect, useState } from "react"
import { Kbd, KbdGroup } from "../ui/kbd"

export function Header() {
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    const isMacOs = /Mac|iPod|iPhone|iPad/.test(navigator.userAgent)
    setIsMac(isMacOs)
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-12 items-center bg-topbar px-4">
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
