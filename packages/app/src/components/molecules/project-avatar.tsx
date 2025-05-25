import type { ChangeEvent, FC } from 'react'
import type { File } from '@/server/types'
import type { Icons } from '@/lib/icons'
import { useState } from 'react'
import { Upload } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { iconList, renderIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'
import { useFetcher } from '@remix-run/react'
import { projectStore } from '@/stores/project'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog'

type ProjectAvatarProps = {
  icon: Icons | undefined
  picture: string
  pictures: File[]
  canUpdate: boolean
  onSelectIcon: (icon: Icons) => void
}

export const ProjectAvatar: FC<ProjectAvatarProps> = ({
  icon,
  picture,
  pictures,
  canUpdate,
  onSelectIcon,
}) => {
  const [showIcons, setShowIcons] = useState(false)
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null)
  const [isPicturesLibraryDialogOpen, setIsPicturesLibraryDialogOpen] =
    useState(false)

  const { project } = projectStore()
  const fetcher = useFetcher()

  const handleUploadPicture = (event: ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData()
    const picture = event.target.files?.[0]
    if (!picture) return
    formData.append('files', picture)
    formData.append('slug', project?.slug ?? '')
    fetcher.submit(formData, {
      method: 'POST',
      action: '/action/projects/upload',
      encType: 'multipart/form-data',
    })
  }

  const handleSelectPicture = (id: number) => {
    const picture = pictures.find((picture) => picture.id === id)
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
    setIsPicturesLibraryDialogOpen(false)
  }

  return (
    <>
      <Avatar className="w-24 h-24">
        <AvatarImage
          className="object-cover object-center"
          src={picture}
          alt=""
        />
        <AvatarFallback
          className={cn({
            'group-hover:opacity-0 transition-opacity duration-300': canUpdate,
          })}
        >
          {icon && renderIcon(icon)}
        </AvatarFallback>
      </Avatar>
      {canUpdate && (
        <>
          <Popover onOpenChange={() => setShowIcons(false)}>
            <PopoverTrigger asChild>
              <button className="absolute inset-0 opacity-0 grid group-hover:opacity-100 duration-300 transition-opacity bg-gray-400/30 rounded-full z-10 place-items-center">
                <Upload />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 flex flex-col gap-y-4">
              {!showIcons ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowIcons(true)}
                  >
                    Choose icon
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsPicturesLibraryDialogOpen(true)}
                  >
                    Choose image from library
                  </Button>
                  <div className="space-y-2">
                    <Label htmlFor="picture">Upload an image</Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={handleUploadPicture}
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-4 gap-2">
                  {(Object.keys(iconList) as Icons[]).map((iconName) => (
                    <Button
                      key={iconName}
                      className={cn('[&_svg]:!size-8 p-2 h-auto')}
                      variant="outline"
                      disabled={iconName === icon}
                      onClick={() => onSelectIcon(iconName)}
                    >
                      {renderIcon(iconName)}
                    </Button>
                  ))}
                </div>
              )}
            </PopoverContent>
          </Popover>
          <Dialog
            open={isPicturesLibraryDialogOpen}
            onOpenChange={setIsPicturesLibraryDialogOpen}
          >
            <DialogContent className="w-full max-w-[56rem]">
              <DialogHeader>
                <h2 className="text-xl font-semibold">Pictures</h2>
              </DialogHeader>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 w-full pt-4">
                {pictures.map(({ id, path }) => (
                  <Button
                    key={id}
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
                ))}
              </div>
              <DialogFooter>
                <Button onClick={handleSavePicture}>Salva</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  )
}
