import { OrganizationDetail } from "@/components/organizations/organization-detail"

export default async function OperatorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return (
    <div className="container">
      <OrganizationDetail id={id} />
    </div>
  )
}
