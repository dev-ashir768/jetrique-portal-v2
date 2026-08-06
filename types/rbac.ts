import type { UUID } from "./common"

export interface Permission {
  id: UUID
  name: string
  slug: string
}

export interface MenuItem {
  id: UUID
  name: string
  slug: string
  path: string | null
  icon: string
  order: number
  parentId: UUID | null
  permissions: Permission[]
  children: MenuItem[]
}

export interface Role {
  id: UUID
  name: string
  slug: string
  description: string
  permissions: Permission[]
}
