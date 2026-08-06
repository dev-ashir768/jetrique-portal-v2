export interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: "SUPER_ADMIN" | "ORG_ADMIN" | "OPERATOR" | "AGENT" | "USER"
}
