import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { ChangeEvent } from 'react'
import { useEffect, useRef } from 'react'
import { useFetcher, useLoaderData } from '@remix-run/react'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { Button } from '@/components/ui/button'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'

export const loader = async (data: LoaderFunctionArgs) => {
  return null
}

export default function ProjectSettingsPage() {
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')
  const data = useLoaderData()
  const fetcher = useFetcher()
  const inputFileRef = useRef<HTMLInputElement>(null)

  const { project } = projectStore()
  const { setBreadcrumb } = breadcrumbStore()

  useEffect(() => {
    if (!project) return
    setBreadcrumb([
      { id: 1, name: project.name, url: `/${project.slug}/` },
      { id: 2, name: 'Media' },
    ])
  }, [project])

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

  return (
    <div className="flex flex-col pb-8">
      <header className="flex flex-col">
        <h1 className="text-3xl font-bold">Media</h1>
        <section className="py-4 flex items-center justify-end gap-x-2">
          <Button type="button" variant="ghost">
            Select all
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
            <Button onClick={() => inputFileRef.current?.click()}>
              Upload media
            </Button>
          </div>
        </section>
      </header>
    </div>
  )
}
