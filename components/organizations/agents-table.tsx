"use client"

import { useState } from "react"
import { useAgents, useApproveOrganization, useRejectOrganization, useSuspendOrganization } from "@/hooks/use-organizations"
import { usePermissions } from "@/hooks/use-permission"
import { DataTable, SortableHeader, features } from "@/components/common/data-table"
import { StatusBadge } from "@/components/ui/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MoreHorizontal } from "lucide-react"
import type { ColumnDef } from "@tanstack/table-core"
import type { Organization, OrganizationFilters, OrganizationStatus } from "@/types"
import { AGENT_CATEGORIES } from "@/lib/constants"

function AgentCategoryBadge({ category }: { category: string | undefined }) {
  if (!category) return <span className="text-muted-foreground">—</span>
  const label = AGENT_CATEGORIES.find((c) => c.value === category)?.label ?? category
  return (
    <Badge variant="outline" className="text-xs font-medium">
      {label}
    </Badge>
  )
}

function ActionsCell({ row }: { row: Organization }) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const [remarks, setRemarks] = useState("")

  const perms = usePermissions("agents", ["approve", "reject", "suspend"])
  const { mutate: approve, isPending: approving } = useApproveOrganization()
  const { mutate: reject, isPending: rejecting } = useRejectOrganization()
  const { mutate: suspend, isPending: suspending } = useSuspendOrganization()

  const canApprove = perms.approve && row.status === "PENDING"
  const canReject = perms.reject && (row.status === "PENDING" || row.status === "APPROVED")
  const canSuspend = perms.suspend && row.status === "APPROVED"

  if (!canApprove && !canReject && !canSuspend) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {canApprove && (
            <DropdownMenuItem onClick={() => approve(row.id)} disabled={approving}>
              Approve
            </DropdownMenuItem>
          )}
          {canReject && (
            <DropdownMenuItem
              onClick={() => setRejectOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              Reject
            </DropdownMenuItem>
          )}
          {canSuspend && (
            <DropdownMenuItem
              onClick={() => suspend(row.id)}
              disabled={suspending}
              className="text-destructive focus:text-destructive"
            >
              Suspend
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Agent</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-1.5">
            <Label>Reason <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder="Provide a reason for rejection…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!remarks.trim() || rejecting}
              onClick={() =>
                reject(
                  { id: row.id, remarks },
                  { onSuccess: () => { setRejectOpen(false); setRemarks("") } },
                )
              }
            >
              {rejecting ? "Rejecting…" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

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
    id: "category",
    header: "Category",
    cell: ({ row }) => (
      <AgentCategoryBadge category={row.original.agentProfile?.category} />
    ),
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
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <ActionsCell row={row.original} />,
  },
]

export function AgentsTable() {
  const [filters, setFilters] = useState<OrganizationFilters>({ page: 1, limit: 10 })
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  const { data, isLoading, refetch } = useAgents(filters)

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
      storageKey="organizations-agents"
      exportFileName="agents"
      searchPlaceholder="Search agents…"
      onSearch={(search) => setFilters((p) => ({ ...p, page: 1, search }))}
      onPaginationChange={(page, limit) => setFilters((p) => ({ ...p, page, limit }))}
      onRefetch={refetch}
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
        {
          key: "category",
          label: "Category",
          type: "select",
          options: AGENT_CATEGORIES.map((c) => ({ label: c.label, value: c.value })),
        },
      ]}
      activeFilters={activeFilters}
      onFilterChange={handleFilterChange}
      emptyMessage="No agents found."
    />
  )
}
