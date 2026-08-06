"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useOperators } from "@/hooks/use-organizations"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import type { ColumnDef } from "@tanstack/table-core"
import type { Organization, OrganizationFilters, OrganizationStatus } from "@/types"

const columns: ColumnDef<typeof features, Organization>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "registrationNumber",
    header: "Reg. No.",
  },
  {
    id: "city",
    header: "City",
    cell: ({ row }) => row.original.city?.name ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as OrganizationStatus} />,
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ getValue }) =>
      new Date(getValue() as string).toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
]

export function OperatorsTable() {
  const router = useRouter()
  const [filters, setFilters] = useState<OrganizationFilters>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const { data, isLoading, refetch } = useOperators(filters)

  const pagination = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total: data?.meta.total ?? 0,
    pages: data?.meta.totalPages ?? 1,
  }

  function handleFilterChange(incoming: Record<string, string>) {
    setActiveFilters(incoming)
    setFilters((prev) => ({
      ...prev,
      page: 1,
      status: (incoming.status as OrganizationStatus) || undefined,
    }))
  }

  return (
    <DataTable
      columns={columns}
      data={data?.items ?? []}
      pagination={pagination}
      isLoading={isLoading}
      storageKey="organizations-operators"
      exportFileName="operators"
      searchPlaceholder="Search operators…"
      onSearch={(search) => setFilters((p) => ({ ...p, page: 1, search }))}
      onPaginationChange={(page, limit) => setFilters((p) => ({ ...p, page, limit }))}
      onRefetch={refetch}
      onRowClick={(row) => router.push(`/organizations/operators/${row.id}`)}
      filters={[
        {
          key: "status",
          label: "Status",
          type: "select",
          options: [
            { label: "Pending", value: "PENDING" },
            { label: "Approved", value: "APPROVED" },
            { label: "Rejected", value: "REJECTED" },
            { label: "Suspended", value: "SUSPENDED" },
          ],
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      emptyMessage="No operators found."
    />
  )
}
