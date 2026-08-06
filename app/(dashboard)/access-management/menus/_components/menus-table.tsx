"use client"

import { useState } from "react"
import { useAllMenus} from "@/hooks/use-rbac"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { Badge } from "@/components/ui/badge"
import type { ColumnDef } from "@tanstack/table-core"
import type { MenuItem, MenusParams } from "@/types"

const columns: ColumnDef<typeof features, MenuItem, any>[] = [
  {
    accessorKey: "name",
    header: ({ column }: any) => (
      <SortableHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "slug",
    header: "Slug",
  },
  {
    accessorKey: "path",
    header: "Path",
    cell: ({ getValue }: any) => getValue() ?? <span className="text-muted-foreground">—</span>,
  },
  {
    accessorKey: "icon",
    header: "Icon",
    cell: ({ getValue }: any) => (
      <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{getValue()}</code>
    ),
  },
  {
    accessorKey: "parentName",
    header: "Parent",
    cell: ({ getValue }: any) => getValue() ?? "-",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ getValue }: any) =>
      getValue() ? (
        <Badge variant="secondary" className="text-green-600">Active</Badge>
      ) : (
        <Badge variant="secondary" className="text-destructive">Inactive</Badge>
      ),
  },
]

export function MenusTable() {
  const [params, setParams] = useState<MenusParams>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const { data, isLoading, refetch } = useAllMenus(params)

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
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pagination={pagination}
      isLoading={isLoading}
      storageKey="rbac-menus"
      exportFileName="menus"
      searchPlaceholder="Search menus..."
      onSearch={(search) => setParams((p) => ({ ...p, page: 1, search }))}
      onSort={(sortBy, sortOrder) => setParams((p) => ({ ...p, sortBy, sortOrder }))}
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
  )
}
