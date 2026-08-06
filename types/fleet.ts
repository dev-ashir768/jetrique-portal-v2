import type { UUID } from "./common"

export interface Aircraft {
  id: UUID
  name: string
  type: string
  model: string
  manufacturer: string
  registrationNumber: string
  capacity: number
  maxRange: number
  speed: number
  yearOfManufacture: number
  status: string
  operatorId: UUID
  operatorName: string
  baseLocationId: UUID
  baseLocationName: string
  images: string[]
  thumbnail: string | null
  amenities: string[]
  description: string
  pricePerHour: number
  rating: number
  totalReviews: number
  createdAt: string
  updatedAt: string
}

export interface AircraftFilters {
  type?: string
  minCapacity?: number
  maxCapacity?: number
  minPrice?: number
  maxPrice?: number
  amenities?: string[]
  locationId?: string
  status?: string
  search?: string
}

export interface AircraftReview {
  id: UUID
  aircraftId: UUID
  userId: UUID
  userName: string
  userAvatar: string | null
  rating: number
  comment: string
  createdAt: string
}
