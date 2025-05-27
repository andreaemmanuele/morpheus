import type { ChangeEvent } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { CheckedState } from '@radix-ui/react-checkbox'
import type { File, PaginatedFiles } from '@/server/types'
import { useState } from 'react'
import { useEffect, useRef } from 'react'
import { redirect, useFetcher, useLoaderData } from '@remix-run/react'
import { projectStore } from '@/stores/project'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { Button } from '@/components/ui/button'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import { projectMediaLoader } from '@/loaders/projects'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Media } from '@/components/molecules/Media'

export const loader = async (data: LoaderFunctionArgs) => {
  const url = new URL(data.request.url)
  const page = url.searchParams.get('page')
  const limit = url.searchParams.get('limit')
  if (!page || !limit) return redirect('?page=1&limit=25')
  const media = await projectMediaLoader(data)
  return { media }
}

export default function ProjectSettingsPage() {
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')

  const [selectedMedia, setSelectedMedia] = useState<File[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const { media } = useLoaderData<{ media: PaginatedFiles }>()
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
      if (selectedMedia.length < media.data.length - 1) setSelectAll(false)
      return
    }
    setSelectedMedia((prev) => [...prev, file])
    if (selectedMedia.length === media.data.length - 1) setSelectAll(true)
  }

  const selectAllMedia = () => {
    if (selectAll) {
      setSelectedMedia([])
      setSelectAll(false)
      return
    }
    setSelectedMedia((prev) => [...prev, ...media.data])
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
    setSelectedMedia([])
  }

  useEffect(() => {
    if (!project) return
    setBreadcrumb([
      { id: 1, name: project.name, url: `/${project.slug}/` },
      { id: 2, name: 'Media' },
    ])
  }, [project])

  return (
    <div className="flex flex-col pb-8 min-h-dvh">
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
      <section className="grid grid-cols-4 lg:grid-cols-6 gap-4 pt-4 flex-1 mb-12">
        {media?.data?.map((file) => (
          <Media
            key={file.id}
            {...file}
            selected={!!selectedMedia.find((media) => media.id === file.id)}
            onSelected={(value) => handleSelectMedia(value, file)}
          />
        ))}
      </section>
      <footer>
        {!!media.pagination.total && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`?page=${media.pagination.page - 1}&limit=${media.pagination.limit}`}
                  disabled={!media.pagination.hasPrevious}
                />
              </PaginationItem>
              {[...Array(media.pagination?.totalPages).keys()].map(
                (page: number) => (
                  <PaginationItem>
                    <PaginationLink
                      href={`?page=${page + 1}&limit=${media.pagination.limit}`}
                      isActive={page + 1 === media.pagination.page}
                    >
                      {page + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href={`?page=${media.pagination.page + 1}&limit=${media.pagination.limit}`}
                  disabled={!media.pagination.hasNext}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </footer>
    </div>
  )
}
