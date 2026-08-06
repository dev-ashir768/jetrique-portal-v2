import type { OrganizationType, OrganizationStatus } from "./common"

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