import type { FCWithClassName } from '@/types'
import type { Icons } from '@/lib/icons'
import { useEffect, useState } from 'react'
import { Form, useFetcher } from '@remix-run/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectAvatar } from '@/components/molecules/project-avatar'
import { projectStore } from '@/stores/project'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'

type ProjectDetailsSectionProps = {
  icon: Icons | undefined
  picture: string
  name: string
}

export const ProjectDetailsSection: FCWithClassName<
  ProjectDetailsSectionProps
> = ({ className = '', icon, picture, name }) => {
  const fetcher = useFetcher()
  const { hasPermission: canUpdate } = useUserHasPermission('project.update')
  const [projectName, setProjectName] = useState('')
  const { project } = projectStore()

  const handleSelectIcon = (icon: Icons) => {
    if (!canUpdate) return
    fetcher.submit(
      { slug: project?.slug ?? '', icon },
      {
        method: 'PATCH',
        action: '/action/projects/update',
      }
    )
  }

  const changeProjectName = () => {
    if (!canUpdate) return
    fetcher.submit(
      { slug: project?.slug ?? '', name: projectName },
      {
        method: 'PATCH',
        action: '/action/projects/update',
      }
    )
  }

  useEffect(() => {
    if (!name) return
    setProjectName(name)
  }, [name])

  return (
    <section className={className}>
      <div className="flex flex-1 gap-x-8 max-w-[36rem]">
        <div className="relative group">
          <ProjectAvatar
            icon={icon}
            picture={picture}
            canUpdate={canUpdate}
            onSelectIcon={handleSelectIcon}
          />
        </div>
        <Form className="flex flex-col gap-y-2 flex-1">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              value={projectName}
              required
              disabled={!canUpdate}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>
          {canUpdate && (
            <Button
              type="submit"
              className="ml-auto"
              variant="secondary"
              size="sm"
              onClick={changeProjectName}
            >
              Update
            </Button>
          )}
        </Form>
      </div>
    </section>
  )
}
