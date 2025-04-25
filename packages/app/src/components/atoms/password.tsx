import type { ComponentProps } from 'react'
import { useState } from 'react'
import { Eye, EyeClosed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function Password({ type: _, ...props }: ComponentProps<'input'>) {
  const [type, setType] = useState<'password' | 'email'>('password')

  const toggleType = () => {
    setType((prev) => (prev === 'password' ? 'email' : 'password'))
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
