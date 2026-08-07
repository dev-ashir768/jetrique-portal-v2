"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAllMenus, useAllPermissions, useRolePermissions, useAssignRolePermissions, useRemoveRolePermissions } from "@/hooks/use-rbac"
import type { Role } from "@/types"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

type CheckKey = `${string}:${string}` // menuId:permissionId

export function ManagePermissionsDialog({ role, open, onOpenChange }: Props) {
  const { data: menusData, isLoading: loadingMenus } = useAllMenus({ isActive: true, limit: 100 })
  const { data: permsData, isLoading: loadingPerms } = useAllPermissions({ isActive: true, limit: 100 })
  const { data: rolePermsData, isLoading: loadingRolePerms } = useRolePermissions(role.id)

  const { mutateAsync: assign, isPending: assigning } = useAssignRolePermissions(role.id)
  const { mutateAsync: remove, isPending: removing } = useRemoveRolePermissions(role.id)

  const [checked, setChecked] = useState<Set<CheckKey>>(new Set())
  const [initial, setInitial] = useState<Set<CheckKey>>(new Set())

  const isLoading = loadingMenus || loadingPerms || loadingRolePerms
  const isSaving = assigning || removing

  // Build initial checked set from current role permissions
  useEffect(() => {
    if (!rolePermsData) return
    const keys = new Set<CheckKey>()
    for (const { menu, permissions } of rolePermsData.menus) {
      for (const perm of permissions) {
        keys.add(`${menu.id}:${perm.id}`)
      }
    }
    setChecked(new Set(keys))
    setInitial(new Set(keys))
  }, [rolePermsData])

  const menus = menusData?.items ?? []
  const permissions = permsData?.items ?? []

  function toggle(menuId: string, permId: string) {
    const key: CheckKey = `${menuId}:${permId}`
    setChecked((prev) => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const hasChanges = useMemo(() => {
    if (checked.size !== initial.size) return true
    for (const k of checked) if (!initial.has(k)) return true
    return false
  }, [checked, initial])

  async function onSave() {
    const toAdd = [...checked].filter((k) => !initial.has(k))
    const toRemove = [...initial].filter((k) => !checked.has(k))

    const parse = (keys: string[]) =>
      keys.map((k) => {
        const [menuId, permissionId] = k.split(":")
        return { menuId, permissionId }
      })

    await Promise.all([
      toAdd.length ? assign({ permissions: parse(toAdd) }) : Promise.resolve(),
      toRemove.length ? remove({ permissions: parse(toRemove) }) : Promise.resolve(),
    ])

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Manage Permissions — {role.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-full rounded-md" />)}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-4 font-medium text-muted-foreground text-xs w-40">Menu</th>
                  {permissions.map((perm) => (
                    <th key={perm.id} className="text-center py-2 px-2 font-medium text-xs text-muted-foreground">
                      {perm.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {menus.map((menu) => (
                  <tr key={menu.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 pr-4 font-medium text-sm">{menu.name}</td>
                    {permissions.map((perm) => {
                      const key: CheckKey = `${menu.id}:${perm.id}`
                      return (
                        <td key={perm.id} className="text-center py-2.5 px-2">
                          <Checkbox
                            checked={checked.has(key)}
                            onCheckedChange={() => toggle(menu.id, perm.id)}
                            disabled={isSaving}
                          />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={isSaving || !hasChanges || isLoading}>
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
