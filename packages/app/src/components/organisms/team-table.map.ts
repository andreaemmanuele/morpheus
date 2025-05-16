import type { TeamMember as TeamMemberServer } from '@/server/types'
import type { TeamMember } from '@/types'

export const mapMembers = (members: TeamMemberServer[]): TeamMember[] =>
  members.map((member) => ({
    id: `${member.user_id}`,
    email: member.email,
    username: member.username,
    role: member.name,
    status: member.status,
  }))
