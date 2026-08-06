import type { UUID, OrganizationType, OrganizationStatus, AgentCategory, DocumentType, DocumentStatus } from "./common"

export interface Organization {
  id: UUID
  name: string
  email: string
  phone: string
  address: string
  type: OrganizationType
  status: OrganizationStatus
  agentCategory?: AgentCategory
  commission: number
  logo: string | null
  documents: OrganizationDocument[]
  createdAt: string
  updatedAt: string
}

export interface OrganizationDocument {
  id: UUID
  organizationId: UUID
  type: DocumentType
  fileName: string
  fileUrl: string
  status: DocumentStatus
  uploadedAt: string
}

export interface UpdateOrganizationCommissionPayload {
  commission: number
}
