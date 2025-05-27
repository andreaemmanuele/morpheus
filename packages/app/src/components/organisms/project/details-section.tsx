import type { FCWithClassName } from '@/types'
import type { Icons } from '@/lib/icons'
import { useEffect, useState } from 'react'
import { Form, useFetcher, useNavigate } from '@remix-run/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectAvatar } from '@/components/molecules/project-avatar'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import { projectStore } from '@/stores/project'

type ProjectDetailsSectionProps = {
  icon: Icons | undefined
  picture: string
  name: string
}

export const ProjectDetailsSection: FCWithClassName<
  ProjectDetailsSectionProps
> = ({ className = '', icon, picture, name }) => {
  const { hasPermission: canUpdate } = useUserHasPermission('project.update')
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')

  const [projectName, setProjectName] = useState('')
  const navigate = useNavigate()
  const fetcher = useFetcher()
  const { project } = projectStore()

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

  const handleSelectIcon = (icon: Icons) => {
    if (!canUpdate) return
    fetcher.submit(
      { slug: project?.slug ?? '', icon, picture: '' },
      {
        method: 'PATCH',
        action: '/action/projects/update',
      }
    )
  }

  const handleUploadPicture = (picture: File | undefined) => {
    if (!canManageFiles) return
    const formData = new FormData()
    if (!picture) return
    formData.append('files', picture)
    formData.append('slug', project?.slug ?? '')
    formData.append('category', 'pictures')
    fetcher.submit(formData, {
      method: 'POST',
      action: '/action/projects/upload-picture',
      encType: 'multipart/form-data',
    })
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
            onUploadPicture={handleUploadPicture}
            onOpenPicturesDialog={() => navigate('pictures?page=1&limit=16')}
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
