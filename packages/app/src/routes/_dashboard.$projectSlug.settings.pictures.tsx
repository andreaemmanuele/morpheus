import type { LoaderFunctionArgs } from '@remix-run/server-runtime'
import type { File as StorageFile, PaginatedFiles } from '@/server/types'
import { useState } from 'react'
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useParams,
} from '@remix-run/react'
import { redirect } from '@remix-run/server-runtime'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'
import { projectPicturesLoader } from '@/loaders/projects'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import { projectStore } from '@/stores/project'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

export const loader = async (data: LoaderFunctionArgs) => {
  const url = new URL(data.request.url)
  const page = url.searchParams.get('page')
  const limit = url.searchParams.get('limit')
  if (!page || !limit) return redirect('?page=1&limit=16')
  const pictures = await projectPicturesLoader(data)
  return { pictures }
}

export default function ProjectSettingsPicturesPage() {
  const { hasPermission: canUpdate } = useUserHasPermission('project.update')
  const { hasPermission: canManageFiles } =
    useUserHasPermission('project.files')

  const { pictures } = useLoaderData<{ pictures: PaginatedFiles }>()
  const { projectSlug } = useParams() as { projectSlug: string }

  const fetcher = useFetcher()
  const navigate = useNavigate()
  const { project } = projectStore()

  const [selectedPicture, setSelectedPicture] = useState<StorageFile | null>(
    null
  )

  const handleSelectPicture = (id: number) => {
    const picture = pictures.data.find((picture) => picture.id === id)
    if (!picture) return
    setSelectedPicture(picture)
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
    closeDialog(false)
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

  const closeDialog = (value: boolean) => {
    if (value) return
    navigate(`/${projectSlug}/settings`)
  }

  return (
    <Dialog open={true} onOpenChange={closeDialog}>
      <DialogContent className="w-full max-w-[56rem]">
        <DialogHeader>
          <h2 className="text-xl font-semibold">Pictures</h2>
        </DialogHeader>
        {pictures.data.length ? (
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full pt-4">
            {pictures.data.map(({ id, url }) => (
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
                    src={url}
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
        <div className="pt-4">
          {!!pictures.pagination.total && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`?page=${pictures.pagination.page - 1}&limit=${pictures.pagination.limit}`}
                    disabled={!pictures.pagination.hasPrevious}
                  />
                </PaginationItem>
                {[...Array(pictures.pagination?.totalPages).keys()].map(
                  (page: number) => (
                    <PaginationItem>
                      <PaginationLink
                        href={`?page=${page + 1}&limit=${pictures.pagination.limit}`}
                        isActive={page + 1 === pictures.pagination.page}
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
                    href={`?page=${pictures.pagination.page + 1}&limit=${pictures.pagination.limit}`}
                    disabled={!pictures.pagination.hasNext}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
        <DialogFooter>
          <Button disabled={!selectedPicture} onClick={handleSavePicture}>
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
