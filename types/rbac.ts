import type { UUID } from "./common"

export interface Permission {
  id: UUID
  name: string
  slug: string
  isActive: boolean
  createdAt: string
}

export interface PermissionsParams {
  page?: number
  limit?: number
  search?: string
  isActive?: boolean
}

export interface PermissionsResponse {
  items: Permission[]
  meta: { total: number }
}

export interface CreatePermissionPayload {
  name: string
  slug: string
}

export interface UpdatePermissionPayload {
  name?: string
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

export interface UpdateMenuPayload {
  name?: string
  slug?: string
  path?: string
  icon?: string
  parentId?: string
  order?: number
}

export interface Role {
  id: UUID
  name: string
  slug: string
  organizationType: string
  organizationId: string | null
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface RolesParams {
  page?: number
  limit?: number
  search?: string
  organizationType?: string
  isSystem?: boolean
}

export interface RolesResponse {
  items: Role[]
  meta: { total: number }
}

export interface CreateRolePayload {
  name: string
  slug: string
  organizationType: string
  isSystem: boolean
  organizationId?: string
}

export interface UpdateRolePayload {
  name?: string
}

export interface RolePermissionEntry {
  menuId: string
  permissionId: string
}

export interface AssignRolePermissionsPayload {
  permissions: RolePermissionEntry[]
}
