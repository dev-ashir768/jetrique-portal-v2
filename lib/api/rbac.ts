import { apiClient } from "./client"

export const rbacApi = {
  getMenus: () =>
    apiClient.get("/rbac/menus"),

  getPermissions: () =>
    apiClient.get("/rbac/permissions"),

  getRoles: () =>
    apiClient.get("/rbac/roles"),

  getMyRBAC: () =>
    apiClient.get("/rbac/my"),

  getMyMenus: () =>
    apiClient.get("/rbac/my/menus"),
}
