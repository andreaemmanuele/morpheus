import { useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import { ProjectSecuritySection } from '@/components/organisms/project/security-section'
import { ProjectDetailsSection } from '@/components/organisms/project/details-section'
import { ProjectTeamSection } from '@/components/organisms/project/team-section'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'

export default function ProjectSettingsPage() {
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
      <ProjectTeamSection className="space-y-8" />
      <ProjectSecuritySection className="space-y-8 pt-12" />
    </div>
  )
}
