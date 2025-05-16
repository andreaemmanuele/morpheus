import type { Icons } from '@/lib/icons'

export type OwnerRole = {
  id: 1
  type: 'owner'
}

export type AdminRole = {
  id: 2
  type: 'admin'
}

export type EditorRole = {
  id: 3
  type: 'editor'
}

export type Roles = OwnerRole | AdminRole | EditorRole
export type UserStatus = 'active' | 'suspended' | 'pending' | 'deleted'

export type User = {
  id: number
  email: string
  username: string | null
  password_hash: string
  password_reset_token: string | null
  password_reset_expires: string | null
  role_id: Roles['id']
  email_verified: boolean
  status: UserStatus
  login_attempts: number
  last_login: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type LoginAttempts = {
  login_attempts: number
}

export type Token = {
  id: number
  user_id: number
  token: string
  expires_at: string
  revoked: boolean
  created_at: string
}

export type Project = {
  id: number
  icon: Icons
  name: string
  slug: string
  is_default: boolean
  created_at: string
  updated_at: string
  deleted_at: string
}

export type Invite = {
  email: string
}

export type TeamMember = {
  user_id: number
  email: string
  username: string
  name: Roles['type']
  status: UserStatus
}
