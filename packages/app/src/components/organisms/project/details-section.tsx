import type { FCWithClassName } from '@/types'
import type { File as StorageFile } from '@/server/types'
import type { Icons } from '@/lib/icons'
import { useEffect, useState } from 'react'
import { Form, useFetcher } from '@remix-run/react'
import { Trash2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ProjectAvatar } from '@/components/molecules/project-avatar'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import { projectStore } from '@/stores/project'

type ProjectDetailsSectionProps = {
  icon: Icons | undefined
  picture: string
  pictures: StorageFile[]
  name: string
}

export const ProjectDetailsSection: FCWithClassName<
  ProjectDetailsSectionProps
> = ({ className = '', icon, picture, pictures, name }) => {
  const { hasPermission: canUpdate } = useUserHasPermission('project.update')
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')

  const [projectName, setProjectName] = useState('')
  const [selectedPicture, setSelectedPicture] = useState<StorageFile | null>(
    null
  )

  const [isPicturesLibraryDialogOpen, setIsPicturesLibraryDialogOpen] =
    useState(false)

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

  const handleSelectPicture = (id: number) => {
    const picture = pictures.find((picture) => picture.id === id)
    if (!picture) return
    setSelectedPicture(picture)
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
      action: '/action/projects/upload',
      encType: 'multipart/form-data',
    })
  }

  const handleSavePicture = () => {
    if (!selectedPicture || !canUpdate) return
    fetcher.submit(
      { slug: project?.slug ?? '', picture: selectedPicture.path },
      {
        method: 'PATCH',
        action: '/action/projects/update',
      }
    )
    setIsPicturesLibraryDialogOpen(false)
  }

  const deletePicture = (id: number) => {
    if (!canManageFiles) return
    fetcher.submit(
      { fileIds: [id] },
      {
        method: 'DELETE',
        action: '/action/projects/delete-files',
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
            onUploadPicture={handleUploadPicture}
            onOpenPicturesDialog={() => setIsPicturesLibraryDialogOpen(true)}
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
      <Dialog
        open={isPicturesLibraryDialogOpen}
        onOpenChange={setIsPicturesLibraryDialogOpen}
      >
        <DialogContent className="w-full max-w-[56rem]">
          <DialogHeader>
            <h2 className="text-xl font-semibold">Pictures</h2>
          </DialogHeader>
          {pictures.length ? (
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full pt-4">
              {pictures.map(({ id, path }) => (
                <div key={id} className="relative group">
                  {selectedPicture?.id !== id && (
                    <Button
                      variant="destructive"
                      className="hidden group-hover:flex items-center justify-center h-6 w-4 absolute top-0 right-0"
                      onClick={() => deletePicture(id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    className="aspect-square h-24 p-1"
                    disabled={id === selectedPicture?.id}
                    onClick={() => handleSelectPicture(id)}
                  >
                    <img
                      src={path}
                      alt=""
                      className="w-full h-full object-cover object-center"
                    />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid place-items-center">
              <p className="text-md">No images uploaded yet</p>
            </div>
          )}
          <DialogFooter>
            <Button disabled={!selectedPicture} onClick={handleSavePicture}>
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
