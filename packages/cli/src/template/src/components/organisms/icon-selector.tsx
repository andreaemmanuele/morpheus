import type { FC } from 'react'
import type { Icons } from '@/lib/icons'
import { useState, useEffect } from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { iconList, renderIcon } from '@/lib/icons'
import { cn } from '@/lib/utils'

type IconSelectorProps = {
  onSelectIcon: (name: Icons) => void
}

export const IconSelector: FC<IconSelectorProps> = ({ onSelectIcon }) => {
  const [selected, setSelected] = useState<Icons>(
    Object.keys(iconList)[0] as Icons
  )

  const handleIconClick = (name: Icons) => {
    setSelected(name)
    onSelectIcon(name)
  }

  useEffect(() => {
    onSelectIcon(selected)
  }, [])

  return (
    <Popover>
      <PopoverTrigger className={cn('p-1 mb-0')}>
        {renderIcon(selected)}
      </PopoverTrigger>
      <PopoverContent className="ml-4 lg:ml-0 mt-2 flex flex-wrap gap-y-1 justify-evenly">
        {(Object.keys(iconList) as Icons[]).map((iconName) => (
          <Button
            key={iconName}
            className={cn('[&_svg]:!size-8 p-2 h-auto')}
            variant="outline"
            disabled={selected === iconName}
            onClick={() => handleIconClick(iconName)}
          >
            {renderIcon(iconName)}
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  )
}
