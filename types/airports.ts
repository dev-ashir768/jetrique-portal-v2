import type { Location, PaginationParams } from "@/types"

export interface Airport {
  id: string
  locationId: string
  name: string
  iataCode: string
  terminal: string | null
  handlingFees: string | null
  timezone: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  location: Location & {
    parent?: (Location & {
      parent?: (Location & {
        parent?: Location | null
      }) | null
    }) | null
  }
}

export interface AirportFilters extends PaginationParams {
  isActive?: boolean
  locationId?: string
}

export interface CreateAirportPayload {
  locationId: string
  name: string
  iataCode: string
  terminal?: string
  handlingFees?: number
  timezone?: string
}

export interface UpdateAirportPayload {
  locationId?: string
  name?: string
  iataCode?: string
  terminal?: string | null
  handlingFees?: number | null
  timezone?: string | null
}
