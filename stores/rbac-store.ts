"use client"

import { create } from "zustand"
import type { MenuItem } from "@/types"

interface RBACState {
  menus: MenuItem[]
  setMenus: (menus: MenuItem[]) => void
  hasPermission: (menuSlug: string, permissionSlug: string) => boolean
  clear: () => void
}

export const useRBACStore = create<RBACState>()((set, get) => ({
  menus: [],
  setMenus: (menus) => set({ menus }),
  hasPermission: (menuSlug, permissionSlug) => {
    const { menus } = get()
    const find = (items: MenuItem[]): boolean =>
      items.some(
        (item) =>
          (item.slug === menuSlug &&
            item.permissions.some((p) => p.slug === permissionSlug)) ||
          find(item.children),
      )
    return find(menus)
  },
  clear: () => set({ menus: [] }),
}))
