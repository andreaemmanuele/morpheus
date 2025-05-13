import type { FCWithClassName } from '@/types'
import type { Icons } from '@/lib/icons'
import { Image } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { renderIcon } from '@/lib/icons'
import { Form } from '@remix-run/react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type ProjectDetailsSectionProps = {
  icon: Icons
  name: string
}

export const ProjectDetailsSection: FCWithClassName<
  ProjectDetailsSectionProps
> = ({ className = '', icon, name }) => (
  <section className={className}>
    <div className="flex gap-x-8 max-w-[36rem]">
      <div className="relative group">
        <button className="absolute inset-0 opacity-0 grid group-hover:opacity-100 duration-300 transition-opacity bg-gray-400/30 rounded-full z-10 place-items-center">
          <Image />
        </button>
        <Avatar className="w-24 h-24">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="group-hover:opacity-0 transition-opacity duration-300">
            {renderIcon(icon ?? 'pill')}
          </AvatarFallback>
        </Avatar>
      </div>
      <Form className="flex flex-col gap-y-2 flex-1">
        <div className="space-y-2">
          <Label htmlFor="name">Project name</Label>
          <Input defaultValue={name} required />
        </div>
        <Button type="submit" className="ml-auto" variant="secondary" size="sm">
          Change name
        </Button>
      </Form>
    </div>
  </section>
)
