"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"
import { useAllMenus, useToggleMenuActive } from "@/hooks/use-rbac"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { PageHeader } from "@/components/common"
import { usePermissions } from "@/hooks/use-permission"
import { CreateMenuDialog } from "./create-menu-dialog"
import { EditMenuDialog } from "./edit-menu-dialog"
import type { ColumnDef } from "@tanstack/table-core"
import type { MenuItem, MenusParams } from "@/types"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function ActiveToggle({ menus, canUpdate }: { menus: MenuItem; canUpdate: boolean }) {
  const { mutate, isPending } = useToggleMenuActive(menus.id, !menus.isActive)
  return (
    <Switch
      checked={menus.isActive}
      disabled={isPending || !canUpdate}
      onCheckedChange={() => mutate()}
    />
  )
}

export function MenusTable() {
  const [params, setParams] = useState<MenusParams>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [editingMenu, setEditingMenu] = useState<MenuItem | null>(null)

  const { data, isLoading, refetch } = useAllMenus(params)
  const permissions = usePermissions("menus", ["approve", "create", "delete", "export", "read", "reject", "suspend", "update"])

  const columns: ColumnDef<typeof features, MenuItem>[] = [
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
      accessorKey: "path",
      header: "Path",
      cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-muted-foreground">—</span>,
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ getValue }) => (
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{getValue() as string}</code>
      ),
    },
    {
      accessorKey: "parentName",
      header: "Parent",
      cell: ({ getValue }) => (getValue() as string | null) ?? "—",
    },
    {
      id: "isActive",
      header: "Active",
      cell: ({ row }) => <ActiveToggle menus={row.original} canUpdate={permissions.update} />,
    },
    ...(permissions.update
      ? [
        {
          id: "actions",
          header: "",
          cell: ({ row }: { row: { original: MenuItem } }) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="secondary" size="icon" className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingMenu(row.original)
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Edit</TooltipContent>
            </Tooltip>
          ),
        } as ColumnDef<typeof features, MenuItem>,
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
      isActive:
        filters.isActive === "true" ? true
          : filters.isActive === "false" ? false
            : undefined,
    }))
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Menus" description="Manage navigation menus and their hierarchy.">
        {permissions.create && <CreateMenuDialog />}
        {permissions.update && editingMenu && (
          <EditMenuDialog
            menu={editingMenu}
            open={!!editingMenu}
            onOpenChange={(o) => { if (!o) setEditingMenu(null) }}
          />
        )}
      </PageHeader>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={pagination}
        isLoading={isLoading}
        storageKey="rbac-menus"
        exportFileName="menus"
        searchPlaceholder="Search menus..."
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
        emptyMessage="No menus found."
      />
    </div>
  )
}
