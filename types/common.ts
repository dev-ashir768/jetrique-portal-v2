export type UUID = string

// Success response (single item)
export interface ApiResponse<T> {
  success: true
  message: string
  data: T
}

// Success response (paginated list)
export interface PaginatedResponse<T> {
  success: true
  message: string
  data: {
    items: T[]
    total: number
    page: number
    limit: number
    pages: number
  }
}

// Error response
export interface ApiError {
  success: false
  message: string
  errors?: Record<string, string>
}

export interface PaginationParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface SelectOption {
  label: string
  value: string
}

export interface DateRange {
  from: Date
  to: Date
}

// Backend enums

export type OrganizationType = "JETRIQUE" | "OPERATOR" | "AGENT"

export type OrganizationStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"

export type AgentCategory = "TOUR_OPERATOR" | "TRAVEL_AGENT" | "HOTEL_PARTNER" | "GENERAL_AGENT"

export type LocationType = "COUNTRY" | "PROVINCE" | "CITY" | "AIRPORT"

export type DocumentType =
  | "DTS_LICENSE"
  | "NTN_CERTIFICATE"
  | "IATA_CERTIFICATE"
  | "TRADE_LICENSE"
  | "OWNER_CNIC_FRONT"
  | "OWNER_CNIC_BACK"
  | "OWNER_VISITING_CARD"
  | "AUTHORIZED_SIGNATORY_CNIC_FRONT"
  | "AUTHORIZED_SIGNATORY_CNIC_BACK"
  | "AUTHORIZED_SIGNATORY_VISITING_CARD"
  | "AOC"
  | "INSURANCE_CERTIFICATE"
  | "C_OF_A"
  | "OPS_SPECS"

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED"

export type UserDocumentType = "CNIC_FRONT" | "CNIC_BACK"

export type UserStatus = "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED"

export type Currency = "PKR" | "USD"

export type WalletTransactionType =
  | "CREDIT_PURCHASE"
  | "BOOKING_DEBIT"
  | "REFUND"
  | "COMMISSION_CREDIT"
  | "ADJUSTMENT"

export type WalletTransactionStatus = "PENDING" | "APPROVED" | "REJECTED"
