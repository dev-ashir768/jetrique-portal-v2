"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useAllPermissions, useTogglePermissionActive } from "@/hooks/use-rbac"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/common"
import { usePermissions } from "@/hooks/use-permission"
import { CreatePermissionDialog } from "./create-permission-dialog"
import { EditPermissionDialog } from "./edit-permission-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ColumnDef } from "@tanstack/table-core"
import type { Permission, PermissionsParams } from "@/types"

function ActiveToggle({ permission, canUpdate }: { permission: Permission; canUpdate: boolean }) {
  const { mutate, isPending } = useTogglePermissionActive(permission.id, !permission.isActive)
  return (
    <Switch
      checked={permission.isActive}
      disabled={isPending || !canUpdate}
      onCheckedChange={() => mutate()}
    />
  )
}

export function PermissionsTable() {
  const [params, setParams] = useState<PermissionsParams>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)

  const { data, isLoading, refetch } = useAllPermissions(params)
  const perms = usePermissions("permissions", ["create", "update"])

  const columns: ColumnDef<typeof features, Permission>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
    },
    {
      accessorKey: "slug",
      header: "Slug",
      cell: ({ getValue }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{getValue() as string}</code>
      ),
    },
    {
      id: "isActive",
      header: "Active",
      cell: ({ row }) => <ActiveToggle permission={row.original} canUpdate={perms.update} />,
    },
    ...(perms.update
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: Permission } }) => (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="secondary" size="icon" className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingPermission(row.original)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            ),
          } as ColumnDef<typeof features, Permission>,
        ]
      : []),
  ]

  const pagination = {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    total: data?.meta.total ?? 0,
    pages: Math.ceil((data?.meta.total ?? 0) / (params.limit ?? 10)),
  }

  function handleFilterChange(filters: Record<string, string>) {
    setActiveFilters(filters)
    setParams((p) => ({
      ...p,
      page: 1,
      isActive: filters.isActive ? filters.isActive === "true" : undefined,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Permissions" description="Manage system permissions and access controls.">
        {perms.create && <CreatePermissionDialog />}
        {perms.update && editingPermission && (
          <EditPermissionDialog
            permission={editingPermission}
            open={!!editingPermission}
            onOpenChange={(o) => { if (!o) setEditingPermission(null) }}
          />
        )}
      </PageHeader>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={pagination}
        isLoading={isLoading}
        storageKey="rbac-permissions"
        exportFileName="permissions"
        searchPlaceholder="Search permissions..."
        onSearch={(search) => setParams((p) => ({ ...p, page: 1, search }))}
        onPaginationChange={(page, limit) => setParams((p) => ({ ...p, page, limit }))}
        onRefetch={refetch}
        filters={[
          {
            key: "isActive",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "true" },
              { label: "Inactive", value: "false" },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        emptyMessage="No permissions found."
      />
    </div>
  )
}
