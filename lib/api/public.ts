import { apiClient } from "./client"
import type { ApiResponse, Location } from "@/types"

export const publicApi = {
  getLocations: (params: { type: string; parentId?: string }) =>
    apiClient.get<ApiResponse<Location[]>>("/locations", { params }),
}
