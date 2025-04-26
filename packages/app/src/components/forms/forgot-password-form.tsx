import type { ComponentPropsWithoutRef, FC } from 'react'
import { Form, NavLink } from '@remix-run/react'
import { LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

type ForgotPasswordFormProps = {
  submitting: boolean
} & ComponentPropsWithoutRef<'div'>

export const ForgotPasswordForm: FC<ForgotPasswordFormProps> = ({
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
          <h1 className="text-xl font-bold">Forgot your password?</h1>
          <div className="text-center text-sm">
            Recover now or{' '}
            <NavLink className="underline underline-offset-4" to="/login">
              login
            </NavLink>
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid gap-y-4 gap-x-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="mail@example.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? <LoaderCircle className="animate-spin" /> : 'Recover'}
          </Button>
        </div>
      </div>
    </Form>
  </div>
)
