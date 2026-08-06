"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useCallback, useEffect } from "react"
import {
  flexRender,
  useTable,
} from "@tanstack/react-table"
import {
  tableFeatures,
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  createSortedRowModel,
  createPaginatedRowModel,
} from "@tanstack/table-core"
import type {
  ColumnDef,
  ColumnVisibilityState,
  SortingState,
  RowData,
} from "@tanstack/table-core"
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  RefreshCw,
  Columns3,
  ListFilter,
  X,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { ReactSelectSingle, type SelectOption } from "@/components/ui/react-select"
import { cn } from "@/lib/utils"

export const features = tableFeatures({
  columnVisibilityFeature,
  rowSortingFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
})

export type { ColumnDef }

export interface ServerPagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface FilterField {
  key: string
  label: string
  type: "text" | "select" | "date"
  options?: { label: string; value: string }[]
  placeholder?: string
}

export interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<typeof features, TData, any>[]
  data: TData[]
  pagination: ServerPagination
  onPaginationChange: (page: number, limit: number) => void
  onSearch?: (search: string) => void
  onSort?: (sortBy: string, sortOrder: "asc" | "desc") => void
  searchPlaceholder?: string
  filters?: FilterField[]
  activeFilters?: Record<string, string>
  onFilterChange?: (filters: Record<string, string>) => void
  onRefetch?: () => void
  exportFileName?: string
  isLoading?: boolean
  emptyMessage?: string
  storageKey?: string
}

// ── Export Helpers ──

function escapeCSV(value: unknown): string {
  const str = String(value ?? "")
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadFile(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function getExportColumns(columns: any[]) {
  return columns.filter((col: any) => col.accessorKey && col.enableHiding !== false)
}

function exportToCSV(data: any[], columns: any[], fileName: string) {
  const exportCols = getExportColumns(columns)
  const headers = exportCols.map((col: any) => col.header?.toString() ?? col.accessorKey)
  const rows = data.map((row) =>
    exportCols.map((col: any) => escapeCSV(row[col.accessorKey as string]))
  )
  const csv = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))].join("\n")
  downloadFile(csv, `${fileName}.csv`, "text/csv;charset=utf-8;")
}

function exportToExcel(data: any[], columns: any[], fileName: string) {
  const exportCols = getExportColumns(columns)
  const headers = exportCols.map((col: any) => col.header?.toString() ?? col.accessorKey)
  const rows = data.map((row) =>
    exportCols.map((col: any) => `<td>${String(row[col.accessorKey as string] ?? "")}</td>`).join("")
  )
  const table = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="UTF-8"></head>
<body><table>
<thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
<tbody>${rows.map((r) => `<tr>${r}</tr>`).join("")}</tbody>
</table></body></html>`
  downloadFile(table, `${fileName}.xls`, "application/vnd.ms-excel")
}

// ── localStorage helpers for column visibility ──

function loadVisibility(key?: string): ColumnVisibilityState {
  if (!key) return {}
  try {
    const stored = localStorage.getItem(`dt-cols-${key}`)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function saveVisibility(key: string | undefined, state: ColumnVisibilityState) {
  if (!key) return
  try {
    localStorage.setItem(`dt-cols-${key}`, JSON.stringify(state))
  } catch { }
}

// ── Sort Header ──

export function SortableHeader({
  column,
  title,
}: {
  column: any
  title: string
}) {
  const sortDir = column.getIsSorted()

  return (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors -ml-2 px-2 py-1 rounded-md"
      onClick={() => {
        const accessorKey = column.columnDef.accessorKey as string
        if (!accessorKey) return
        column.toggleSorting(sortDir === "asc")
      }}
    >
      {title}
      {sortDir === "asc" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sortDir === "desc" ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />
      )}
    </button>
  )
}

// ── Filter Dialog ──

function FilterDialog({
  filters,
  activeFilters,
  onFilterChange,
}: {
  filters: FilterField[]
  activeFilters: Record<string, string>
  onFilterChange: (filters: Record<string, string>) => void
}) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>(activeFilters)
  const [open, setOpen] = useState(false)

  const activeCount = Object.values(activeFilters).filter(Boolean).length

  const handleApply = () => {
    onFilterChange(localFilters)
    setOpen(false)
  }

  const handleClear = () => {
    const cleared: Record<string, string> = {}
    filters.forEach((f) => (cleared[f.key] = ""))
    setLocalFilters(cleared)
    onFilterChange(cleared)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setLocalFilters(activeFilters) }}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="relative h-8 w-8">
              <ListFilter className="h-4 w-4" />
              {activeCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Filters</TooltipContent>
      </Tooltip>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex flex-col gap-1.5">
              <Label className="text-xs">{filter.label}</Label>
              {filter.type === "select" ? (
                <ReactSelectSingle
                  options={filter.options ?? []}
                  value={filter.options?.find((o) => o.value === localFilters[filter.key]) ?? null}
                  onChange={(opt: SelectOption | null) =>
                    setLocalFilters((p) => ({ ...p, [filter.key]: opt?.value ?? "" }))
                  }
                  placeholder={filter.placeholder || `Select ${filter.label}`}
                  isClearable
                />
              ) : (
                <Input
                  placeholder={filter.placeholder || `Enter ${filter.label}`}
                  value={localFilters[filter.key] || ""}
                  onChange={(e) => setLocalFilters((p) => ({ ...p, [filter.key]: e.target.value }))}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={handleApply}>
            Apply Filter
          </Button>
          <Button variant="secondary" size="lg" onClick={handleClear}>
            Clear all
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── Active Filter Badges ──

function ActiveFilterBadges({
  filters,
  activeFilters,
  onRemove,
}: {
  filters: FilterField[]
  activeFilters: Record<string, string>
  onRemove: (key: string) => void
}) {
  const active = Object.entries(activeFilters).filter(([, v]) => Boolean(v))
  if (active.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1.5">
      {active.map(([key, value]) => {
        const field = filters.find((f) => f.key === key)
        const displayValue = field?.type === "select"
          ? field.options?.find((o) => o.value === value)?.label ?? value
          : value

        return (
          <Badge key={key} variant="secondary" className="gap-1 pr-1">
            <span className="text-muted-foreground">{field?.label}:</span> {displayValue}
            <button onClick={() => onRemove(key)} className="ml-0.5 rounded-sm hover:bg-accent p-0.5">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )
      })}
    </div>
  )
}

// ── Main DataTable ──

export function DataTable<TData extends RowData>({
  columns,
  data,
  pagination,
  onPaginationChange,
  onSearch,
  onSort,
  searchPlaceholder = "Search...",
  filters,
  activeFilters = {},
  onFilterChange,
  onRefetch,
  exportFileName = "export",
  isLoading = false,
  emptyMessage = "No results found.",
  storageKey,
}: DataTableProps<TData>) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>(() =>
    loadVisibility(storageKey)
  )
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    saveVisibility(storageKey, columnVisibility)
  }, [storageKey, columnVisibility])

  const table = useTable({
    data,
    columns,
    features,
    state: {
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater
      setSorting(next)
      if (next.length > 0) {
        onSort?.(next[0].id, next[0].desc ? "desc" : "asc")
      }
    },
    manualPagination: true,
    manualSorting: !!onSort,
    rowCount: pagination.total,
  })

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      onSearch?.(value)
    },
    [onSearch]
  )

  const handleFilterRemove = useCallback(
    (key: string) => {
      onFilterChange?.({ ...activeFilters, [key]: "" })
    },
    [activeFilters, onFilterChange]
  )

  const startRow = (pagination.page - 1) * pagination.limit + 1
  const endRow = Math.min(pagination.page * pagination.limit, pagination.total)

  return (
    <div className="flex flex-col gap-0 rounded-md bg-white overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {onSearch && (
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full md:max-w-xs"
            />
          )}

          {filters && (
            <ActiveFilterBadges
              filters={filters}
              activeFilters={activeFilters}
              onRemove={handleFilterRemove}
            />
          )}
        </div>

        <div className="flex items-center gap-1.5 self-end md:self-auto">
          {onRefetch && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onRefetch}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Refresh</TooltipContent>
            </Tooltip>
          )}

          {filters && filters.length > 0 && onFilterChange && (
            <FilterDialog
              filters={filters}
              activeFilters={activeFilters}
              onFilterChange={onFilterChange}
            />
          )}

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Columns3 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Columns</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.id}
                    checked={col.getIsVisible()}
                    onCheckedChange={(v) => col.toggleVisibility(!!v)}
                    className="capitalize"
                  >
                    {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Export</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportToCSV(data, columns as any[], exportFileName)}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToExcel(data, columns as any[], exportFileName)}>
                Export as Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-400/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-gray-50/80 hover:bg-gray-50/80 border-none">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "text-sm font-semibold uppercase text-gray-700 px-3 h-10",
                      header.column.getCanSort() && "cursor-pointer select-none",
                    )}
                    style={{ width: (header.column.columnDef as any).size }}
                    onClick={header.column.getCanSort()
                      ? () => header.column.toggleSorting(header.column.getIsSorted() === "asc")
                      : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="[&_tr:last-child]:border-b">
            {isLoading ? (
              Array.from({ length: pagination.limit }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  {columns.map((_, ci) => (
                    <TableCell key={ci} className="px-3 py-2">
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="py-16 text-center text-sm text-gray-700">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="transition-colors border-b border-gray-50 hover:bg-gray-50/80"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 text-sm text-gray-700">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center gap-2 p-2.5 justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination.total > 0
            ? `Showing ${startRow}–${endRow} of ${pagination.total}`
            : "No results"}
        </p>

        <div className="flex items-center gap-2">
          <Select
            value={String(pagination.limit)}
            onValueChange={(v) => onPaginationChange(1, Number(v))}
          >
            <SelectTrigger className="w-17.5 h-8!">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(1, pagination.limit)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(pagination.page - 1, pagination.limit)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous page</TooltipContent>
            </Tooltip>

            <span className="px-2 text-sm text-muted-foreground">
              {pagination.page} / {pagination.pages || 1}
            </span>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(pagination.page + 1, pagination.limit)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next page</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onPaginationChange(pagination.pages, pagination.limit)}
                  disabled={pagination.page >= pagination.pages}
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last page</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}
