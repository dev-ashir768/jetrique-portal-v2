import { apiClient } from "./client"
import type { PaginationParams } from "@/types"

export const organizationsApi = {
  getAll: (params?: PaginationParams) =>
    apiClient.get("/organizations", { params }),

  getById: (id: string) =>
    apiClient.get(`/organizations/${id}`),

  approve: (id: string) =>
    apiClient.patch(`/organizations/${id}/approve`),

  reject: (id: string) =>
    apiClient.patch(`/organizations/${id}/reject`),

  suspend: (id: string) =>
    apiClient.patch(`/organizations/${id}/suspend`),

  updateCommission: (id: string, commission: number) =>
    apiClient.patch(`/organizations/${id}/commission`, { commission }),

  getDocuments: (id: string) =>
    apiClient.get(`/organizations/${id}/documents`),

  reuploadDocument: (id: string, documentId: string, file: File) => {
    const formData = new FormData()
    formData.append("document", file)
    return apiClient.patch(
      `/organizations/${id}/documents/${documentId}/reupload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    )
  },

  getOperators: () =>
    apiClient.get("/organizations/operators"),

  getAgents: () =>
    apiClient.get("/organizations/agents"),
}
