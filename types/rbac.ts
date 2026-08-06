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
  isActive: boolean
  createdAt: string
  updatedAt: string
  permissions?: Permission[]
  children: MenuItem[]
}

export interface MenusParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface MenusResponse {
  items: MenuItem[]
  meta: { total: number }
}

export interface Role {
  id: UUID
  name: string
  slug: string
  description: string
  permissions: Permission[]
}
