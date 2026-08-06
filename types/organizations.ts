import type { OrganizationType, OrganizationStatus, AgentCategory, Location, ApiResponse } from "./common"

export interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedResult<T> {
  items: T[]
  meta: PaginatedMeta
}

export type PaginatedApiResponse<T> = ApiResponse<PaginatedResult<T>>

export interface OperatorProfile {
  id: string
  organizationId: string
  createdAt: string
  updatedAt: string
}

export interface AgentProfile {
  id: string
  organizationId: string
  category: AgentCategory
  createdAt: string
  updatedAt: string
}

export interface Organization {
  id: string
  name: string
  type: OrganizationType
  status: OrganizationStatus
  email: string
  phone: string
  address: string
  cityId: string
  registrationNumber: string
  remarks: string | null
  approvedById: string | null
  approvedAt: string | null
  createdAt: string
  updatedAt: string
  operatorProfile: OperatorProfile | null
  agentProfile: AgentProfile | null
  city: Location | null
}

export interface OrganizationFilters {
  page?: number
  limit?: number
  search?: string
  status?: OrganizationStatus
  organizationId?: string
}
