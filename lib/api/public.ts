import { apiClient } from "./client"

export const publicApi = {
  getLocationTree: () =>
    apiClient.get("/public/locations"),

  getLocationTreeFiltered: (params: { country?: string; state?: string; type?: string }) =>
    apiClient.get("/public/locations/filter", { params }),
}
