"use client"

import { useState } from "react"
import { Pencil, ShieldPlus } from "lucide-react"
import { useAllRoles } from "@/hooks/use-rbac"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common"
import { usePermissions } from "@/hooks/use-permission"
import { CreateRoleDialog } from "./create-role-dialog"
import { EditRoleDialog } from "./edit-role-dialog"
import { ManagePermissionsDialog } from "./manage-permissions-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ColumnDef } from "@tanstack/table-core"
import type { Role, RolesParams } from "@/types"

export function RolesTable() {
  const [params, setParams] = useState<RolesParams>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [managingRole, setManagingRole] = useState<Role | null>(null)

  const { data, isLoading, refetch } = useAllRoles(params)
  const perms = usePermissions("roles", ["create", "update"])

  const columns: ColumnDef<typeof features, Role>[] = [
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
      accessorKey: "organizationType",
      header: "Org Type",
      cell: ({ getValue }) => (
        <Badge variant="outline">{getValue() as string}</Badge>
      ),
    },
    {
      accessorKey: "isSystem",
      header: "System",
      cell: ({ getValue }) =>
        getValue() ? (
          <Badge variant="secondary">System</Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        ),
    },
    ...(perms.update
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: Role } }) => (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary" size="icon" className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); setManagingRole(row.original) }}
                    >
                      <ShieldPlus className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Manage Permissions</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="secondary" size="icon" className="h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); setEditingRole(row.original) }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              </div>
            ),
          } as ColumnDef<typeof features, Role>,
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
      organizationType: filters.organizationType || undefined,
      isSystem: filters.isSystem ? filters.isSystem === "true" : undefined,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Roles" description="Manage roles and their organization types.">
        {perms.create && <CreateRoleDialog />}
        {perms.update && editingRole && (
          <EditRoleDialog
            role={editingRole}
            open={!!editingRole}
            onOpenChange={(o) => { if (!o) setEditingRole(null) }}
          />
        )}
        {perms.update && managingRole && (
          <ManagePermissionsDialog
            role={managingRole}
            open={!!managingRole}
            onOpenChange={(o) => { if (!o) setManagingRole(null) }}
          />
        )}
      </PageHeader>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={pagination}
        isLoading={isLoading}
        storageKey="rbac-roles"
        exportFileName="roles"
        searchPlaceholder="Search roles..."
        onSearch={(search) => setParams((p) => ({ ...p, page: 1, search }))}
        onPaginationChange={(page, limit) => setParams((p) => ({ ...p, page, limit }))}
        onRefetch={refetch}
        filters={[
          {
            key: "organizationType",
            label: "Org Type",
            type: "select",
            options: [
              { label: "Operator", value: "OPERATOR" },
              { label: "Airline", value: "AIRLINE" },
              { label: "Admin", value: "ADMIN" },
            ],
          },
          {
            key: "isSystem",
            label: "System",
            type: "select",
            options: [
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ],
          },
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        emptyMessage="No roles found."
      />
    </div>
  )
}
