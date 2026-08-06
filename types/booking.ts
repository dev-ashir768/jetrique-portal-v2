import type { UUID } from "./common"

export interface Booking {
  id: UUID
  bookingRef: string
  userId: UUID
  aircraftId: UUID
  aircraftName: string
  aircraftType: string
  aircraftThumbnail: string | null
  operatorId: UUID
  operatorName: string
  departureLocationId: UUID
  departureName: string
  arrivalLocationId: UUID
  arrivalName: string
  departureDate: string
  departureTime: string
  returnDate: string | null
  returnTime: string | null
  isRoundTrip: boolean
  passengers: Passenger[]
  passengerCount: number
  specialRequests: string | null
  status: string
  pricing: BookingPricing
  paymentMethod: string
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export interface Passenger {
  id?: UUID
  firstName: string
  lastName: string
  email?: string
  phone?: string
  documentType?: string
  documentNumber?: string
}

export interface BookingPricing {
  basePrice: number
  fuelSurcharge: number
  serviceFee: number
  taxes: number
  discount: number
  totalPrice: number
  currency: string
}

export interface CreateBookingPayload {
  aircraftId: UUID
  departureLocationId: UUID
  arrivalLocationId: UUID
  departureDate: string
  departureTime: string
  returnDate?: string
  returnTime?: string
  isRoundTrip: boolean
  passengers: Passenger[]
  specialRequests?: string
  paymentMethod: string
}

export interface BookingFilters {
  status?: string
  fromDate?: string
  toDate?: string
  aircraftType?: string
  search?: string
}
