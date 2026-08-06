import type { UUID } from "./common"

export interface Menu {
  id: UUID
  name: string
  path: string
  icon: string
  parentId: UUID | null
  order: number
  children?: Menu[]
}

export interface Permission {
  id: UUID
  name: string
  slug: string
  module: string
  description: string
}

export interface Role {
  id: UUID
  name: string
  slug: string
  description: string
  permissions: Permission[]
}

export interface UserRBAC {
  menus: Menu[]
  permissions: string[]
  role: Role
}
