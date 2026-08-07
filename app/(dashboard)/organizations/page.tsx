import { OrganizationsTable } from "@/components/organizations/organizations-table"

export const metadata = {
  title: "Organizations",
}

export default function OrganizationsPage() {
  return (
    <div className="container flex flex-col gap-6">
      <OrganizationsTable />
    </div>
  )
}
