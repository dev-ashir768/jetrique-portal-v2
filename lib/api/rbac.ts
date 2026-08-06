import { apiClient } from "./client"
import type { ApiResponse, MenuItem } from "@/types"

export const rbacApi = {
  getMyMenus: () =>
    apiClient.get<ApiResponse<MenuItem[]>>("/rbac/me/menus"),
}
