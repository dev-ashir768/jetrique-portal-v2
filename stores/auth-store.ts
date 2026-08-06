"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AuthUser } from "@/types"
import { TOKEN_KEY } from "@/lib/constants"

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  setUser: (user: AuthUser | null) => void
  setAuth: (user: AuthUser, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setAuth: (user, token) => {
        localStorage.setItem(TOKEN_KEY, token)
        set({ user, isAuthenticated: true })
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY)
        set({ user: null, isAuthenticated: false })
      },
    }),
    { name: "jetrique-auth" },
  ),
)
