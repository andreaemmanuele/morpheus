import type { ChangeEvent, FC } from 'react'
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

type ProjectAvatarProps = {
  icon: Icons | undefined
  picture: string
  canUpdate: boolean
  onSelectIcon: (icon: Icons) => void
}

export const ProjectAvatar: FC<ProjectAvatarProps> = ({
  icon,
  picture,
  canUpdate,
  onSelectIcon,
}) => {
  const [showIcons, setShowIcons] = useState(false)
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
                <span className="mx-auto">Or</span>
                <div className="space-y-2">
                  <Label htmlFor="picture">Upload an image</Label>
                  <Input
                    id="picture"
                    type="file"
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
      )}
    </>
  )
}
