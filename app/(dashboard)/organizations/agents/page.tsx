import { AgentsTable } from "@/components/organizations/agents-table"

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">Agents</h1>
        <p className="text-sm text-muted-foreground">Manage agent organizations and their registrations.</p>
      </div>
      <AgentsTable />
    </div>
  )
}
