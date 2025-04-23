import type { ComponentPropsWithoutRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/ui/logo'

export function LoginForm({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form>
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
                type="email"
                placeholder="m@example.com"
                required
              />
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
