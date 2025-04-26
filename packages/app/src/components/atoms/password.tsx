import type { ComponentProps, FC } from 'react'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const Password: FC<ComponentProps<'input'>> = ({
  type: _,
  ...props
}) => {
  const [type, setType] = useState<'password' | 'text'>('password')

  const toggleType = () => {
    setType((prev) => (prev === 'password' ? 'text' : 'password'))
  }

  return (
    <div className="flex gap-x-2">
      <Input type={type} {...props} />
      <Button type="button" onClick={toggleType}>
        {type === 'password' ? <Eye /> : <EyeClosed />}
      </Button>
    </div>
  )
}
