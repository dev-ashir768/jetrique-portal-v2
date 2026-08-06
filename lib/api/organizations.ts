import { apiClient } from "./client"
import type { ApiResponse } from "@/types"
import type {
  Organization,
  OrganizationDocument,
  OrganizationFilters,
  PaginatedApiResponse,
} from "@/types/organizations"

export const organizationsApi = {
  getOperators: (params?: OrganizationFilters) =>
    apiClient.get<PaginatedApiResponse<Organization>>("/organizations/operators", { params }),

  getAgents: (params?: OrganizationFilters) =>
    apiClient.get<PaginatedApiResponse<Organization>>("/organizations/agents", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Organization>>(`/organizations/${id}`),

  getDocuments: (id: string) =>
    apiClient.get<ApiResponse<OrganizationDocument[]>>(`/organizations/${id}/documents`),

  verifyDocument: (orgId: string, docId: string) =>
    apiClient.patch<ApiResponse<OrganizationDocument>>(
      `/organizations/${orgId}/documents/${docId}/verify`,
    ),

  rejectDocument: (orgId: string, docId: string, remarks: string) =>
    apiClient.patch<ApiResponse<OrganizationDocument>>(
      `/organizations/${orgId}/documents/${docId}/reject`,
      { remarks },
    ),

  approve: (id: string, payload?: { commissionRate?: number }) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/approve`, payload ?? {}),

  reject: (id: string, remarks: string) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/reject`, { remarks }),

  suspend: (id: string, remarks: string) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/suspend`, { remarks }),
}
