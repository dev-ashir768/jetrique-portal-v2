export const ORGANIZATION_TYPES = [
  { label: "Jetrique", value: "JETRIQUE" },
  { label: "Operator", value: "OPERATOR" },
  { label: "Agent", value: "AGENT" },
] as const

export const ORGANIZATION_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
] as const

export const AGENT_CATEGORIES = [
  { label: "Tour Operator", value: "TOUR_OPERATOR" },
  { label: "Travel Agent", value: "TRAVEL_AGENT" },
  { label: "Hotel Partner", value: "HOTEL_PARTNER" },
  { label: "General Agent", value: "GENERAL_AGENT" },
] as const

export const LOCATION_TYPES = [
  { label: "Country", value: "COUNTRY" },
  { label: "Province", value: "PROVINCE" },
  { label: "City", value: "CITY" },
  { label: "Airport", value: "AIRPORT" },
] as const

export const DOCUMENT_TYPES = [
  { label: "DTS License", value: "DTS_LICENSE" },
  { label: "NTN Certificate", value: "NTN_CERTIFICATE" },
  { label: "IATA Certificate", value: "IATA_CERTIFICATE" },
  { label: "Trade License", value: "TRADE_LICENSE" },
  { label: "Owner CNIC Front", value: "OWNER_CNIC_FRONT" },
  { label: "Owner CNIC Back", value: "OWNER_CNIC_BACK" },
  { label: "Owner Visiting Card", value: "OWNER_VISITING_CARD" },
  { label: "Auth. Signatory CNIC Front", value: "AUTHORIZED_SIGNATORY_CNIC_FRONT" },
  { label: "Auth. Signatory CNIC Back", value: "AUTHORIZED_SIGNATORY_CNIC_BACK" },
  { label: "Auth. Signatory Visiting Card", value: "AUTHORIZED_SIGNATORY_VISITING_CARD" },
  { label: "AOC", value: "AOC" },
  { label: "Insurance Certificate", value: "INSURANCE_CERTIFICATE" },
  { label: "Certificate of Airworthiness", value: "C_OF_A" },
  { label: "Operations Specifications", value: "OPS_SPECS" },
] as const

export const DOCUMENT_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
] as const

export const USER_DOCUMENT_TYPES = [
  { label: "CNIC Front", value: "CNIC_FRONT" },
  { label: "CNIC Back", value: "CNIC_BACK" },
] as const

export const USER_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Suspended", value: "SUSPENDED" },
] as const

export const CURRENCIES = [
  { label: "PKR", value: "PKR" },
  { label: "USD", value: "USD" },
] as const

export const WALLET_TRANSACTION_TYPES = [
  { label: "Credit Purchase", value: "CREDIT_PURCHASE" },
  { label: "Booking Debit", value: "BOOKING_DEBIT" },
  { label: "Refund", value: "REFUND" },
  { label: "Commission Credit", value: "COMMISSION_CREDIT" },
  { label: "Adjustment", value: "ADJUSTMENT" },
] as const

export const WALLET_TRANSACTION_STATUSES = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
] as const

export const USER_ROLES = [
  { label: "Super Admin", value: "SUPER_ADMIN" },
  { label: "Org Admin", value: "ORG_ADMIN" },
  { label: "Operator", value: "OPERATOR" },
  { label: "Agent", value: "AGENT" },
  { label: "User", value: "USER" },
] as const

export const DEFAULT_PAGE_SIZE = 10
export const TOKEN_KEY = "jetrique_token"
