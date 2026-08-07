import { apiClient } from "./client"
import type { MenusResponse, ApiResponse, MenuItem, MenusParams, CreateMenuPayload, UpdateMenuPayload, PermissionsResponse, Permission, PermissionsParams, CreatePermissionPayload, UpdatePermissionPayload } from "@/types"

export const rbacApi = {
  getMyMenus: () =>
    apiClient.get<ApiResponse<MenuItem[]>>("/rbac/me/menus"),

  getMenus: (params?: MenusParams) =>
    apiClient.get<ApiResponse<MenusResponse>>("/rbac/menus", { params }),

  toggleMenuActive: (id: string, isActive: boolean) =>
    apiClient.patch<ApiResponse<MenuItem>>(`/rbac/menus/${id}/active`, { isActive }),

  createMenu: (payload: CreateMenuPayload) =>
    apiClient.post<ApiResponse<MenuItem>>("/rbac/menus", payload),

  updateMenu: (id: string, payload: UpdateMenuPayload) =>
    apiClient.patch<ApiResponse<MenuItem>>(`/rbac/menus/${id}`, payload),

  getPermissions: (params?: PermissionsParams) =>
    apiClient.get<ApiResponse<PermissionsResponse>>("/rbac/permissions", { params }),

  togglePermissionActive: (id: string, isActive: boolean) =>
    apiClient.patch<ApiResponse<Permission>>(`/rbac/permissions/${id}/active`, { isActive }),

  createPermission: (payload: CreatePermissionPayload) =>
    apiClient.post<ApiResponse<Permission>>("/rbac/permissions", payload),

  updatePermission: (id: string, payload: UpdatePermissionPayload) =>
    apiClient.patch<ApiResponse<Permission>>(`/rbac/permissions/${id}`, payload),
}
