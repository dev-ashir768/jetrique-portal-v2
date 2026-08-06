import type { UUID, UserStatus, UserDocumentType, DocumentStatus } from "./common"

export interface User {
  id: UUID
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
  organizationId: UUID | null
  status: UserStatus
  avatar: string | null
  commission: number | null
  isEmailVerified: boolean
  is2FAEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  phone: string
  role: string
}

export interface UserDocument {
  id: UUID
  userId: UUID
  type: UserDocumentType
  fileName: string
  fileUrl: string
  status: DocumentStatus
  rejectionReason?: string
  uploadedAt: string
  verifiedAt?: string
}

export interface UpdateCommissionPayload {
  commission: number
}

export interface TeamMember extends User {
  budget?: number
}
