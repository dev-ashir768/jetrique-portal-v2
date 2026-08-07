"use client"

import { useState } from "react"
import { Plus, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { PageHeader } from "@/components/common/page-header"
import { useAirports, useSetAirportActive } from "@/hooks/use-airports"
import { usePermissions } from "@/hooks/use-permission"
import { AirportFormDialog } from "./airport-form-dialog"
import type { ColumnDef } from "@tanstack/table-core"
import type { Airport, AirportFilters } from "@/types/airports"

function ActiveToggle({ airport, canUpdate }: { airport: Airport; canUpdate: boolean }) {
  const { mutate, isPending } = useSetAirportActive(airport.id)
  return (
    <Switch
      checked={airport.isActive}
      disabled={isPending || !canUpdate}
      onCheckedChange={(checked) => mutate(checked)}
    />
  )
}

export function AirportsTable() {
  const [filters, setFilters] = useState<AirportFilters>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAirport, setEditingAirport] = useState<Airport | null>(null)

  const { data, isLoading, refetch } = useAirports(filters)
  const perms = usePermissions("airports", ["create", "update"])

  const pagination = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 10,
    total: data?.meta.total ?? 0,
    pages: data?.meta.totalPages ?? 1,
  }

  const columns: ColumnDef<typeof features, Airport>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Airport Name" />,
    },
    {
      accessorKey: "iataCode",
      header: "IATA",
    },
    {
      id: "location",
      header: "Location",
      cell: ({ row }) => {
        const loc = row.original.location
        const city = loc?.parent?.name
        return city ? `${city}, ${loc.name}` : loc?.name ?? "—"
      },
    },
    {
      accessorKey: "terminal",
      header: "Terminal",
      cell: ({ getValue }) => (getValue() as string | null) ?? "—",
    },
    {
      accessorKey: "handlingFees",
      header: "Handling Fees",
      cell: ({ getValue }) => {
        const v = getValue() as string | null
        return v ? `PKR ${Number(v).toLocaleString()}` : "—"
      },
    },
    {
      accessorKey: "timezone",
      header: "Timezone",
      cell: ({ getValue }) => (getValue() as string | null) ?? "—",
    },
    {
      id: "isActive",
      header: "Active",
      cell: ({ row }) => <ActiveToggle airport={row.original} canUpdate={perms.update} />,
    },
    ...(perms.update
      ? [
          {
            id: "actions",
            header: "",
            cell: ({ row }: { row: { original: Airport } }) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  setEditingAirport(row.original)
                  setDialogOpen(true)
                }}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            ),
          } as ColumnDef<typeof features, Airport>,
        ]
      : []),
  ]

  function handleFilterChange(incoming: Record<string, string>) {
    setActiveFilters(incoming)
    setFilters((prev) => ({
      ...prev,
      page: 1,
      isActive: incoming.isActive !== undefined ? incoming.isActive === "true" : undefined,
    }))
  }

  function handleAdd() {
    setEditingAirport(null)
    setDialogOpen(true)
  }

  return (
    <>
      <PageHeader title="Airports" description="Manage airport locations and their details">
        {perms.create && (
          <Button onClick={handleAdd}>
            Add Airport
          </Button>
        )}
      </PageHeader>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        pagination={pagination}
        isLoading={isLoading}
        storageKey="airports"
        exportFileName="airports"
        searchPlaceholder="Search by name or IATA…"
        onSearch={(search) => setFilters((p) => ({ ...p, page: 1, search }))}
        onPaginationChange={(page, limit) => setFilters((p) => ({ ...p, page, limit }))}
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
        emptyMessage="No airports found."
      />

      {(perms.create || perms.update) && (
        <AirportFormDialog
          open={dialogOpen}
          onOpenChange={(o) => {
            setDialogOpen(o)
            if (!o) setEditingAirport(null)
          }}
          airport={editingAirport}
        />
      )}
    </>
  )
}
