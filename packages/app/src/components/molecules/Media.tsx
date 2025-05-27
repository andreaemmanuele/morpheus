import type { FC } from 'react'
import type { File } from '@/server/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Card } from '@/components/ui/card'
import { FileArchive, FileAudio, Files } from 'lucide-react'
import { IconPdf } from '@tabler/icons-react'
import { Link } from '@remix-run/react'

type MediaProps = {
  selected: boolean
  onSelected: (selected: boolean) => void
} & File

export const Media: FC<MediaProps> = ({
  original_name,
  path,
  url,
  file_type,
  selected,
  onSelected,
}) => {
  return (
    <Card className="p-2 aspect-square">
      <Checkbox
        checked={selected}
        className="dark:border-white"
        onCheckedChange={onSelected}
      />
      {file_type === 'image' && (
        <img src={path} className="aspect-square object-cover" alt="" />
      )}
      {file_type === 'video' && <video className="aspect-square" src={url} />}
      {file_type === 'audio' && (
        <div className="aspect-square flex justify-center items-center">
          <FileAudio className="size-10/12" />
        </div>
      )}
      {file_type === 'pdf' && (
        <div className="aspect-square flex justify-center items-center">
          <IconPdf className="size-10/12" />
        </div>
      )}
      {['document', 'other'].includes(file_type) && (
        <div className="aspect-square flex justify-center items-center">
          <Files className="size-10/12" />
        </div>
      )}
      {['archive'].includes(file_type) && (
        <div className="aspect-square flex justify-center items-center">
          <FileArchive className="size-10/12" />
        </div>
      )}
      <Link
        to={url}
        className="line-clamp-1 hover:text-neutral-300"
        target="_blank"
      >
        {original_name}
      </Link>
    </Card>
  )
}
