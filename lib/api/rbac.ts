import { apiClient } from "./client"
import type { ApiResponse, MenuItem, MenusParams, MenusResponse } from "@/types"

export const rbacApi = {
  getMyMenus: () =>
    apiClient.get<ApiResponse<MenuItem[]>>("/rbac/me/menus"),

  getMenus: (params?: MenusParams) =>
    apiClient.get<ApiResponse<MenusResponse>>("/rbac/menus", { params }),
}
