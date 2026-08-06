import { apiClient } from "./client"
import type { MenusResponse, ApiResponse, MenuItem, MenusParams } from "@/types"

export const rbacApi = {
  getMyMenus: () =>
    apiClient.get<ApiResponse<MenuItem[]>>("/rbac/me/menus"),

  getMenus: (params?: MenusParams) =>
    apiClient.get<ApiResponse<MenusResponse>>("/rbac/menus", { params }),

  toggleMenuActive: (id: string, isActive: boolean) =>
    apiClient.patch<ApiResponse<MenuItem>>(`/rbac/menus/${id}/active`, { isActive }),
}
