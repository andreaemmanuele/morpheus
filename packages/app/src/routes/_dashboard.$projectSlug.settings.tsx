import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { Role, TeamMember as TeamMemberServer } from '@/server/types'
import { useEffect } from 'react'
import { Outlet, useLoaderData } from '@remix-run/react'
import { projectTeamLoader } from '@/loaders/projects'
import { getRoles } from '@/loaders/roles'
import { Separator } from '@/components/ui/separator'
import { ProjectSecuritySection } from '@/components/organisms/project/security-section'
import { ProjectDetailsSection } from '@/components/organisms/project/details-section'
import { ProjectTeamSection } from '@/components/organisms/project/team-section'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { mapMembers } from '@/components/organisms/team-table.map'

export const loader = async (data: LoaderFunctionArgs) => {
  const { members } = await projectTeamLoader(data)
  const roles = await getRoles(data)
  return { members, roles }
}

export default function ProjectSettingsPage() {
  const { members, roles } = useLoaderData<{
    members: TeamMemberServer[]
    roles: Role[]
  }>()

  const { project } = projectStore()
  const { setBreadcrumb } = breadcrumbStore()

  const _members = mapMembers(members)

  useEffect(() => {
    if (!project) return
    setBreadcrumb([
      { id: 1, name: project.name, url: `/${project.slug}/` },
      { id: 2, name: 'Settings' },
    ])
  }, [project])

  return (
    <div className="flex flex-col pb-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <ProjectDetailsSection
        className="space-y-8 pt-12 flex justify-end"
        icon={project?.icon}
        picture={project?.picture ?? ''}
        name={project?.name ?? ''}
      />
      <Separator className="mt-16 mb-12" />
      <ProjectTeamSection
        className="space-y-8"
        members={_members}
        roles={roles}
      />
      <ProjectSecuritySection
        className="space-y-8 pt-12"
        members={_members.filter(({ role }) => role !== 'owner')}
      />
      <Outlet />
    </div>
  )
}
