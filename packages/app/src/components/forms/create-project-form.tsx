import type { FC, FormEvent } from 'react'
import type { Icons } from '@/lib/icons'
import { useState } from 'react'
import { Form } from '@remix-run/react'
import slugify from 'slugify'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { IconSelector } from '@/components/organisms/icon-selector'
import { LoaderCircle } from 'lucide-react'

export type CreateProjectFormProps = {
  submitting: boolean
}

export const CreateProjectForm: FC<CreateProjectFormProps> = ({
  submitting = false,
}) => {
  const [icon, setIcon] = useState<Icons>()
  const [slug, setSlug] = useState('')

  const handleSelectIcon = (iconName: Icons) => {
    setIcon(iconName)
  }

  const handleNameInput = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    setSlug(slugify(target.value, { lower: true }))
  }

  return (
    <Form method="post">
      <div className="space-y-4 mb-4">
        <div className="flex gap-x-8">
          <div className="shrink-0 space-y-4">
            <Label htmlFor="name">Icon</Label>
            <IconSelector onSelectIcon={handleSelectIcon} />
            <Input type="hidden" id="icon" name="icon" value={icon} required />
          </div>
          <div className="space-y-4 flex-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Name of your project"
              required
              onChange={handleNameInput}
            />
          </div>
        </div>
        <Label htmlFor="slug">Slug</Label>
        <Input
          id="slug"
          className="pointer-events-none"
          name="slug"
          value={slug}
          readOnly
          required
        />
        <Label htmlFor="invites">Invites members</Label>
        <Textarea
          placeholder="m@example.com, m1@example.com, ..."
          id="invites"
          name="invites"
          rows={6}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="w-40">
          {submitting ? <LoaderCircle className="animate-spin" /> : 'Create'}
        </Button>
      </div>
    </Form>
  )
}
