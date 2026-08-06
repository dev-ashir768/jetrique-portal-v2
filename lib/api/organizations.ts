import { apiClient } from "./client"
import type { ApiResponse } from "@/types"
import type { Organization, OrganizationFilters, PaginatedApiResponse } from "@/types/organizations"

export const organizationsApi = {
  getOperators: (params?: OrganizationFilters) =>
    apiClient.get<PaginatedApiResponse<Organization>>("/organizations/operators", { params }),

  getAgents: (params?: OrganizationFilters) =>
    apiClient.get<PaginatedApiResponse<Organization>>("/organizations/agents", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Organization>>(`/organizations/${id}`),

  approve: (id: string) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/approve`),

  reject: (id: string, remarks: string) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/reject`, { remarks }),

  suspend: (id: string) =>
    apiClient.patch<ApiResponse<Organization>>(`/organizations/${id}/suspend`),
}
