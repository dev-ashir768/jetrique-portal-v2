import { apiClient } from "./client"
import type { CreateUserPayload, PaginationParams } from "@/types"

export const usersApi = {
  create: (payload: CreateUserPayload) =>
    apiClient.post("/users", payload),

  getMyTeam: (params?: PaginationParams) =>
    apiClient.get("/users/team", { params }),

  getPending: (params?: PaginationParams) =>
    apiClient.get("/users/pending", { params }),

  approve: (id: string) =>
    apiClient.patch(`/users/${id}/approve`),

  reject: (id: string) =>
    apiClient.patch(`/users/${id}/reject`),

  suspend: (id: string) =>
    apiClient.patch(`/users/${id}/suspend`),

  updateCommission: (id: string, commission: number) =>
    apiClient.patch(`/users/${id}/commission`, { commission }),

  getDocuments: (id: string) =>
    apiClient.get(`/users/${id}/documents`),

  verifyDocument: (id: string, documentId: string) =>
    apiClient.patch(`/users/${id}/documents/${documentId}/verify`),

  rejectDocument: (id: string, documentId: string) =>
    apiClient.patch(`/users/${id}/documents/${documentId}/reject`),

  reuploadDocument: (documentId: string, file: File) => {
    const formData = new FormData()
    formData.append("document", file)
    return apiClient.patch(
      `/users/documents/${documentId}/reupload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    )
  },
}
