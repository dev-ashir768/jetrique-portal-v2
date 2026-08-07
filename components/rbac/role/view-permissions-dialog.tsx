"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useRolePermissions, useRemoveRolePermissions } from "@/hooks/use-rbac"
import type { Role } from "@/types"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewPermissionsDialog({ role, open, onOpenChange }: Props) {
  const { data, isLoading } = useRolePermissions(role.id)
  const { mutate: remove, isPending } = useRemoveRolePermissions(role.id)

  function handleRemove(menuId: string, permissionId: string) {
    remove({ permissions: [{ menuId, permissionId }] })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Permissions — {role.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
          </div>
        ) : !data?.menus.length ? (
          <p className="text-sm text-muted-foreground text-center py-6">No permissions assigned.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {data.menus.map(({ menu, permissions }) => (
              <div key={menu.id} className="rounded-md border p-3 flex flex-col gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {menu.name}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {permissions.map((perm) => (
                    <Badge
                      key={perm.id}
                      variant="secondary"
                      className="flex items-center gap-1 pr-1"
                    >
                      {perm.name}
                      <button
                        type="button"
                        disabled={isPending}
                        className="ml-0.5 rounded-full hover:bg-destructive/20 p-0.5 transition-colors disabled:opacity-50"
                        onClick={() => handleRemove(menu.id, perm.id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
