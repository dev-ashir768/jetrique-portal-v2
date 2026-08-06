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
  parentName?: string
  permissions?: Permission[]
  children: MenuItem[]
}

export interface MenusParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface MenusResponse {
  items: MenuItem[]
  meta: { total: number }
}

export interface CreateMenuPayload {
  name: string
  slug: string
  icon: string
  order: number
  path?: string | null
  parentId?: string | null
}

export interface Role {
  id: UUID
  name: string
  slug: string
  description: string
  permissions: Permission[]
}
