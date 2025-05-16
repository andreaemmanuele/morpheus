import type { ComponentPropsWithoutRef, FC } from 'react'
import { Form, NavLink } from '@remix-run/react'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Logo } from '@/components/atoms/logo'
import { Password } from '@/components/atoms/password'
import { cn } from '@/lib/utils'

type JoinProjectFormProps = {
  submitting: boolean
} & ComponentPropsWithoutRef<'div'>

export const JoinProjectForm: FC<JoinProjectFormProps> = ({
  className,
  submitting,
  ...props
}) => (
  <div className={cn('flex flex-col gap-6', className)} {...props}>
    <Form method="post">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <NavLink
            to="/"
            className="flex flex-col items-center gap-2 font-medium"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md">
              <Logo />
            </div>
            <span className="sr-only">Morpheus</span>
          </NavLink>
          <h1 className="text-xl font-bold">Join Project now</h1>
          <div className="text-center text-sm">
            Create your account in a few steps
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-y-4 gap-x-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required />
            <Label htmlFor="password">Password</Label>
            <Password id="password" name="password" required />
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Password id="confirm-password" name="confirm-password" required />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : 'Join'}
          </Button>
        </div>
      </div>
    </Form>
  </div>
)
