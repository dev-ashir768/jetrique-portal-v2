import type { OrganizationType, OrganizationStatus, AgentCategory } from "./common"

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data: {
    token: string
    user: AuthUser
  }
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  organization: AuthOrganization
}

export interface AuthOrganization {
  id: string
  name: string
  type: OrganizationType
  status: OrganizationStatus
}

export interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  role: "OPERATOR" | "AGENT"
  organizationName?: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  password: string
  confirmPassword: string
}

export interface RegisterPayload {
  organizationName: string
  organizationType: "OPERATOR" | "AGENT"
  organizationEmail: string
  organizationPhone: string
  organizationPhoneCountry: string
  registrationNumber: string
  address: string
  agentCategory?: AgentCategory
  adminName: string
  adminEmail: string
  adminPassword: string
  cityId: string
  dtsLicense?: File
  ntnCertificate?: File
  iataCertificate?: File
  tradeLicense?: File
  ownerCnicFront?: File
  ownerCnicBack?: File
  ownerVisitingCard?: File
  authorizedSignatoryCnicFront?: File
  authorizedSignatoryCnicBack?: File
  authorizedSignatoryVisitingCard?: File
  aoc?: File
  insuranceCertificate?: File
  cOfA?: File
  opsSpecs?: File
}