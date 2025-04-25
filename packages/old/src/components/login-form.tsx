import type { ComponentPropsWithoutRef } from 'react'
import { Form } from 'react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/ui/logo'
import { cn } from '@/lib/utils'

export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Form method="post">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md">
                <Logo />
              </div>
              <span className="sr-only">Morpheus</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to Morpheus</h1>
            <div className="text-center text-sm">
              Forgot your password?{' '}
              <a href="#" className="underline underline-offset-4">
                Reset now
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="grid gap-y-4 gap-x-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                required
              />
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}
