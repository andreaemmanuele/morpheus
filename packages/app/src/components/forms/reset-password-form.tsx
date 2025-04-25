import type { ComponentPropsWithoutRef } from 'react'
import { Form, NavLink } from '@remix-run/react'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'
import { Password } from '@/components/atoms/password'

type ResetPasswordFormProps = {
  submitting: boolean
} & ComponentPropsWithoutRef<'div'>

export function ResetPasswordForm({
  className,
  submitting,
  ...props
}: ResetPasswordFormProps) {
  return (
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
            <h1 className="text-xl font-bold">Reset your password</h1>
            <div className="text-center text-sm">
              Avoid using personal information or common words.
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-y-4 gap-x-2">
              <Label htmlFor="password">New password</Label>
              <Password id="password" name="password" required />
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Password
                id="confirm-password"
                name="confirm-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <LoaderCircle className="animate-spin" /> : 'Reset'}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
