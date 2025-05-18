import type { FCWithClassName } from '@/types'
import type { Icons } from '@/lib/icons'
import { Form } from '@remix-run/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectAvatar } from '@/components/molecules/project-avatar'
import { projectStore } from '@/stores/project'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'

type ProjectDetailsSectionProps = {
  icon: Icons
  name: string
}

export const ProjectDetailsSection: FCWithClassName<
  ProjectDetailsSectionProps
> = ({ className = '', icon, name }) => {
  const { hasPermission: canUpdate } = useUserHasPermission('project.update')
  const { project, setProject } = projectStore()
  const handleSelectIcon = (icon: Icons) => {
    if (!project || !canUpdate) return
    setProject({ ...project, icon }) // replace with action to change project icon in db
  }
  return (
    <section className={className}>
      <div className="flex flex-1 gap-x-8 max-w-[36rem]">
        <div className="relative group">
          <ProjectAvatar
            icon={icon}
            canUpdate={canUpdate}
            onSelectIcon={handleSelectIcon}
          />
        </div>
        <Form className="flex flex-col gap-y-2 flex-1">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input defaultValue={name} required disabled={!canUpdate} />
          </div>
          {canUpdate && (
            <Button
              type="submit"
              className="ml-auto"
              variant="secondary"
              size="sm"
            >
              Change name
            </Button>
          )}
        </Form>
      </div>
    </section>
  )
}
