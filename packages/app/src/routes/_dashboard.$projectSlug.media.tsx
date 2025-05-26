import type { ChangeEvent } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { CheckedState } from '@radix-ui/react-checkbox'
import type { File } from '@/server/types'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { Button } from '@/components/ui/button'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import { projectMediaLoader } from '@/loaders/projects'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

export const loader = async (data: LoaderFunctionArgs) => {
  const media = await projectMediaLoader(data)
  return { media }
}

export default function ProjectSettingsPage() {
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')

  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const { media } = useLoaderData<{ media: File[] }>()
  const fetcher = useFetcher()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { project } = projectStore()
  const { setBreadcrumb } = breadcrumbStore()

  const uploadFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!canManageFiles) return
    const formData = new FormData()
    formData.append('slug', project?.slug ?? '')
    formData.append('category', 'media')
    const files = e.target.files
    if (!files || !files.length) return
    for (const file of files) {
      formData.append('files', file)
    }
    fetcher.submit(formData, {
      method: 'POST',
      action: '/action/projects/upload',
      encType: 'multipart/form-data',
    })
  }

  const handleSelectMedia = (checked: CheckedState, file: File) => {
    if (!checked) {
      setSelectedMedia((prev) => [
        ...prev.filter((media) => media.id !== file.id),
      ])
      if (selectedMedia.length < media.length - 1) setSelectAll(false)
      return
    }
    setSelectedMedia((prev) => [...prev, file])
    if (selectedMedia.length === media.length - 1) setSelectAll(true)
  }

  const selectAllMedia = () => {
    if (selectAll) {
      setSelectedMedia([])
      setSelectAll(false)
      return
    }
    setSelectedMedia((prev) => [...prev, ...media])
    setSelectAll(true)
  }

  const deleteFiles = () => {
    fetcher.submit(
      {
        slug: project?.slug ?? '',
        fileIds: selectedMedia.map((media) => media.id),
      },
      { method: 'DELETE', action: '/action/projects/delete-files' }
    )
  }

  useEffect(() => {
    if (!project) return
    setBreadcrumb([
      { id: 1, name: project.name, url: `/${project.slug}/` },
      { id: 2, name: 'Media' },
    ])
  }, [project])

  return (
    <div className="flex flex-col pb-8">
      <header className="flex flex-col">
        <h1 className="text-3xl font-bold">Media</h1>
        <section className="py-4 flex items-center justify-end gap-x-2">
          {!!selectedMedia.length && (
            <Button
              type="button"
              className="animate-in fade-in-60"
              variant="destructive"
              onClick={deleteFiles}
            >
              Delete selected
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={selectAllMedia}>
            {selectAll ? 'Deselect All' : 'Select All'}
          </Button>
          <div className="relative flex flex-col items-center">
            <input
              ref={inputFileRef}
              tabIndex={-1}
              type="file"
              name="media"
              multiple
              className="opacity-0 absolute inset-0 cursor-pointer -z-10"
              onChange={uploadFiles}
            />
            <Button type="button" onClick={() => inputFileRef.current?.click()}>
              Upload media
            </Button>
          </div>
        </section>
      </header>
      <section className="grid grid-cols-6 gap-x-4 pt-4">
        {media.map((file) => (
          <Card key={file.id} className="p-2">
            <Checkbox
              checked={!!selectedMedia.find((media) => media.id === file.id)}
              className="dark:border-white"
              onCheckedChange={(value) => handleSelectMedia(value, file)}
            />
            {file.file_type === 'image' ? (
              <img
                src={file.path}
                className="aspect-square object-cover"
                alt=""
              />
            ) : null}
          </Card>
        ))}
      </section>
    </div>
  )
}
