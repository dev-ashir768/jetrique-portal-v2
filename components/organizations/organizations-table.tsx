"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useOrganizations } from "@/hooks/use-organizations"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/common"
import type { ColumnDef } from "@tanstack/table-core"
import type { Organization, OrganizationFilters } from "@/types/organizations"
import { AGENT_CATEGORIES } from "@/lib/constants"
import { OrganizationStatus } from "@/types"

function AgentCategoryBadge({ category }: { category: string | undefined }) {
  if (!category) return <span className="text-muted-foreground">—</span>
  const label = AGENT_CATEGORIES.find((c) => c.value === category)?.label ?? category
  return <Badge variant="outline" className="text-xs font-medium">{label}</Badge>
}

export function OrganizationsTable() {
  const router = useRouter()
  const [filters, setFilters] = useState<OrganizationFilters>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const { data, isLoading, refetch } = useOrganizations(filters)

  const orgType = filters.type ?? "OPERATOR"

  const pagination = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total: data?.meta.total ?? 0,
    pages: data?.meta.totalPages ?? 1,
  }

  function handleFilterChange(incoming: Record<string, string>) {
    setActiveFilters(incoming)
    const newType = incoming.type || undefined
    setFilters((prev) => ({
      ...prev,
      page: 1,
      type: newType,
      status: (incoming.status as OrganizationStatus) || undefined,
      agentCategory: newType === "AGENT" ? (incoming.agentCategory || undefined) : undefined,
    }))
  }

  const columns: ColumnDef<typeof features, Organization>[] = useMemo(() => [
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
    ...(orgType === "AGENT"
      ? [
          {
            id: "category",
            header: "Category",
            cell: ({ row }: { row: { original: Organization } }) => (
              <AgentCategoryBadge category={row.original.agentProfile?.agentCategory} />
            ),
          } as ColumnDef<typeof features, Organization>,
        ]
      : [
          {
            accessorKey: "registrationNumber",
            header: "Reg. No.",
          } as ColumnDef<typeof features, Organization>,
        ]),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [orgType])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Organizations" description="Manage operator and agent organizations." />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={pagination}
        isLoading={isLoading}
        storageKey="organizations"
        exportFileName="organizations"
        searchPlaceholder="Search organizations…"
        onSearch={(search) => setFilters((p) => ({ ...p, page: 1, search }))}
        onPaginationChange={(page, limit) => setFilters((p) => ({ ...p, page, limit }))}
        onRefetch={refetch}
        onRowClick={(row) => router.push(`/organizations/${row.id}`)}
        filters={[
          {
            key: "type",
            label: "Type",
            type: "select",
            options: [
              { label: "Operator", value: "OPERATOR" },
              { label: "Agent", value: "AGENT" },
            ],
          },
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
          ...(orgType === "AGENT"
            ? [
                {
                  key: "agentCategory",
                  label: "Category",
                  type: "select" as const,
                  options: AGENT_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
                },
              ]
            : []),
        ]}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        emptyMessage="No organizations found."
      />
    </div>
  )
}
