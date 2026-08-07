"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getErrorMessage, rbacApi } from "@/lib/api"
import { useRBACStore } from "@/stores"
import type { MenusParams, CreateMenuPayload, UpdateMenuPayload, PermissionsParams, CreatePermissionPayload, UpdatePermissionPayload, RolesParams, CreateRolePayload, UpdateRolePayload, AssignRolePermissionsPayload } from "@/types"
import { toast } from "sonner"

export function useMyMenus() {
  const { setMenus } = useRBACStore()

  return useQuery({
    queryKey: ["rbac", "my-menus"],
    queryFn: async () => {
      const { data } = await rbacApi.getMyMenus()
      setMenus(data.data)
      return data.data
    },
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  })
}

export function useAllMenus(params?: MenusParams) {
  return useQuery({
    queryKey: ["rbac", "all-menus", params],
    queryFn: async () => {
      const { data } = await rbacApi.getMenus(params)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateMenuPayload) => rbacApi.createMenu(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-menus"] }),
  })
}

export function useUpdateMenu(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateMenuPayload) => rbacApi.updateMenu(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-menus"] }),
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useToggleMenuActive(id: string, isActive: boolean) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rbacApi.toggleMenuActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac", "all-menus"] })
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useAllPermissions(params?: PermissionsParams) {
  return useQuery({
    queryKey: ["rbac", "all-permissions", params],
    queryFn: async () => {
      const { data } = await rbacApi.getPermissions(params)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreatePermission() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePermissionPayload) => rbacApi.createPermission(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-permissions"] }),
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdatePermission(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdatePermissionPayload) => rbacApi.updatePermission(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-permissions"] }),
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useTogglePermissionActive(id: string, isActive: boolean) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => rbacApi.togglePermissionActive(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rbac", "all-permissions"] })
      toast.success("Permission updated")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useAllRoles(params?: RolesParams) {
  return useQuery({
    queryKey: ["rbac", "all-roles", params],
    queryFn: async () => {
      const { data } = await rbacApi.getRoles(params)
      return data.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => rbacApi.createRole(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-roles"] }),
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useUpdateRole(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateRolePayload) => rbacApi.updateRole(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rbac", "all-roles"] }),
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useAssignRolePermissions(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AssignRolePermissionsPayload) => rbacApi.assignRolePermissions(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rbac", "all-roles"] })
      qc.invalidateQueries({ queryKey: ["rbac", "role-permissions", id] })
      toast.success("Permissions assigned")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}

export function useRolePermissions(id: string) {
  return useQuery({
    queryKey: ["rbac", "role-permissions", id],
    queryFn: async () => {
      const { data } = await rbacApi.getRolePermissions(id)
      return data.data
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  })
}

export function useRemoveRolePermissions(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: AssignRolePermissionsPayload) => rbacApi.removeRolePermissions(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["rbac", "role-permissions", id] })
      toast.success("Permission removed")
    },
    onError: (error: Error) => toast.error(getErrorMessage(error)),
  })
}