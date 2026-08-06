import { useQuery } from "@tanstack/react-query"
import { publicApi } from "@/lib/api/public"
import type { Location } from "@/types"

function extractLocations(data: unknown): Location[] {
  if (Array.isArray(data)) return data
  // paginated shape: { items: [...] }
  if (data && typeof data === "object" && "items" in data && Array.isArray((data as { items: unknown }).items)) {
    return (data as { items: Location[] }).items
  }
  return []
}

export function useCountries() {
  return useQuery({
    queryKey: ["locations", "COUNTRY"],
    queryFn: () =>
      publicApi
        .getLocations({ type: "COUNTRY" })
        .then((r) => extractLocations(r.data.data)),
    staleTime: 10 * 60 * 1000,
  })
}

export function useProvinces(countryId: string | null) {
  return useQuery({
    queryKey: ["locations", "PROVINCE", countryId],
    queryFn: () =>
      publicApi
        .getLocations({ type: "PROVINCE", parentId: countryId! })
        .then((r) => extractLocations(r.data.data)),
    enabled: !!countryId,
    staleTime: 10 * 60 * 1000,
  })
}

export function useCities(provinceId: string | null) {
  return useQuery({
    queryKey: ["locations", "CITY", provinceId],
    queryFn: () =>
      publicApi
        .getLocations({ type: "CITY", parentId: provinceId! })
        .then((r) => extractLocations(r.data.data)),
    enabled: !!provinceId,
    staleTime: 10 * 60 * 1000,
  })
}
