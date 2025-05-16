import type { TeamMember as TeamMemberServer } from '@/server/types'
import { useEffect } from 'react'
import { useLoaderData } from '@remix-run/react'
import { Separator } from '@/components/ui/separator'
import { ProjectSecuritySection } from '@/components/organisms/project/security-section'
import { ProjectDetailsSection } from '@/components/organisms/project/details-section'
import { ProjectTeamSection } from '@/components/organisms/project/team-section'
import { projectTeamLoader } from '@/loaders/projects'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { mapMembers } from '@/components/organisms/team-table.map'

export const loader = projectTeamLoader

export default function ProjectSettingsPage() {
  const { members } = useLoaderData<{ members: TeamMemberServer[] }>()
  const { project } = projectStore()
  const { setBreadcrumb } = breadcrumbStore()

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
        icon={project?.icon ?? 'pill'}
        name={project?.name ?? ''}
      />
      <Separator className="mt-16 mb-12" />
      <ProjectTeamSection className="space-y-8" members={mapMembers(members)} />
      <ProjectSecuritySection className="space-y-8 pt-12" />
    </div>
  )
}
