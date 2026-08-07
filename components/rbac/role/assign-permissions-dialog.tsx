"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReactSelectSingle } from "@/components/ui/react-select"
import { useAssignRolePermissions, useAllMenus, useAllPermissions } from "@/hooks/use-rbac"
import type { Role, RolePermissionEntry, SelectOption } from "@/types"

interface Props {
  role: Role
  open: boolean
  onOpenChange: (open: boolean) => void
}

const EMPTY_ROW: RolePermissionEntry = { menuId: "", permissionId: "" }

export function AssignPermissionsDialog({ role, open, onOpenChange }: Props) {
  const [rows, setRows] = useState<RolePermissionEntry[]>([{ ...EMPTY_ROW }])

  const { mutateAsync, isPending } = useAssignRolePermissions(role.id)
  const { data: menusData } = useAllMenus({ isActive: true, limit: 100 })
  const { data: permissionsData } = useAllPermissions({ isActive: true, limit: 100 })

  const menuOptions: SelectOption[] = (menusData?.items ?? []).map((m) => ({ label: m.name, value: m.id }))
  const permissionOptions: SelectOption[] = (permissionsData?.items ?? []).map((p) => ({ label: p.name, value: p.id }))

  function updateRow(index: number, field: keyof RolePermissionEntry, value: string) {
    setRows((prev) => prev.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }

  function addRow() {
    setRows((prev) => [...prev, { ...EMPTY_ROW }])
  }

  function removeRow(index: number) {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }

  async function onSubmit() {
    const valid = rows.filter((r) => r.menuId && r.permissionId)
    if (!valid.length) return
    await mutateAsync({ permissions: valid })
    setRows([{ ...EMPTY_ROW }])
    onOpenChange(false)
  }

  function handleOpenChange(o: boolean) {
    if (!o) setRows([{ ...EMPTY_ROW }])
    onOpenChange(o)
  }

  const canSubmit = rows.some((r) => r.menuId && r.permissionId)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign Permissions — {role.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-2 text-xs text-muted-foreground">
            <span>Menu</span>
            <span>Permission</span>
          </div>

          {rows.map((row, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr_auto] items-center gap-2">
              <ReactSelectSingle
                options={menuOptions}
                value={menuOptions.find((o) => o.value === row.menuId) ?? null}
                onChange={(opt) => updateRow(index, "menuId", opt?.value ?? "")}
                placeholder="Select menu"
              />
              <ReactSelectSingle
                options={permissionOptions}
                value={permissionOptions.find((o) => o.value === row.permissionId) ?? null}
                onChange={(opt) => updateRow(index, "permissionId", opt?.value ?? "")}
                placeholder="Select permission"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                disabled={rows.length === 1}
                onClick={() => removeRow(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button type="button" variant="outline" size="sm" className="self-start" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
        </div>

        <div className="flex justify-center gap-4 pt-2">
          <Button onClick={onSubmit} disabled={isPending || !canSubmit}>
            {isPending ? "Assigning…" : "Assign"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
