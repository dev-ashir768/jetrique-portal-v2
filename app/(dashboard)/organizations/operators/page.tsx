import { OperatorsTable } from "@/components/organizations/operators-table"

export default function OperatorsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Operators</h1>
        <p className="text-sm text-muted-foreground">Manage operator organizations and their registrations.</p>
      </div>
      <OperatorsTable />
    </div>
  )
}
