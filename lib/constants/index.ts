

export const AGENT_CATEGORIES = [
  { label: "Tour Operator", value: "TOUR_OPERATOR" },
  { label: "Travel Agent", value: "TRAVEL_AGENT" },
  { label: "Hotel Partner", value: "HOTEL_PARTNER" },
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

export const DEFAULT_PAGE_SIZE = 10
export const TOKEN_KEY = "jetrique_token"

export const DOCUMENT_FIELD_MAP: Record<string, string> = {
  DTS_LICENSE: "dtsLicense",
  NTN_CERTIFICATE: "ntnCertificate",
  IATA_CERTIFICATE: "iataCertificate",
  TRADE_LICENSE: "tradeLicense",
  OWNER_CNIC_FRONT: "ownerCnicFront",
  OWNER_CNIC_BACK: "ownerCnicBack",
  OWNER_VISITING_CARD: "ownerVisitingCard",
  AUTHORIZED_SIGNATORY_CNIC_FRONT: "authorizedSignatoryCnicFront",
  AUTHORIZED_SIGNATORY_CNIC_BACK: "authorizedSignatoryCnicBack",
  AUTHORIZED_SIGNATORY_VISITING_CARD: "authorizedSignatoryVisitingCard",
  AOC: "aoc",
  INSURANCE_CERTIFICATE: "insuranceCertificate",
  C_OF_A: "cOfA",
  OPS_SPECS: "opsSpecs",
}

export const REQUIRED_DOCUMENTS_BY_CATEGORY: Record<string, string[]> = {
  TOUR_OPERATOR: ["DTS_LICENSE", "NTN_CERTIFICATE", "IATA_CERTIFICATE", "OWNER_CNIC_FRONT", "OWNER_CNIC_BACK", "OWNER_VISITING_CARD"],
  TRAVEL_AGENT: ["DTS_LICENSE", "NTN_CERTIFICATE", "IATA_CERTIFICATE", "OWNER_CNIC_FRONT", "OWNER_CNIC_BACK", "OWNER_VISITING_CARD"],
  HOTEL_PARTNER: ["DTS_LICENSE", "TRADE_LICENSE", "NTN_CERTIFICATE", "AUTHORIZED_SIGNATORY_CNIC_FRONT", "AUTHORIZED_SIGNATORY_CNIC_BACK", "AUTHORIZED_SIGNATORY_VISITING_CARD"]
}

export const REQUIRED_OPERATOR_DOCUMENTS: string[] = ["AOC", "INSURANCE_CERTIFICATE", "C_OF_A", "OPS_SPECS"]
