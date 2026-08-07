import { apiClient } from "./client"
import type { ApiResponse } from "@/types"
import type { Airport, AirportFilters, CreateAirportPayload, UpdateAirportPayload } from "@/types/airports"

interface PaginatedAirports {
  items: Airport[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const airportsApi = {
  getAll: (params?: AirportFilters) =>
    apiClient.get<ApiResponse<PaginatedAirports>>("/airports", { params }),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Airport>>(`/airports/${id}`),

  create: (payload: CreateAirportPayload) =>
    apiClient.post<ApiResponse<Airport>>("/airports", payload),

  update: (id: string, payload: UpdateAirportPayload) =>
    apiClient.patch<ApiResponse<Airport>>(`/airports/${id}`, payload),

  setActive: (id: string, isActive: boolean) =>
    apiClient.patch<ApiResponse<Airport>>(`/airports/${id}/active`, { isActive }),
}
