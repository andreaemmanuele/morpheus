import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export function Logo({
  width,
  height,
  className,
  ...props
}: ComponentProps<'svg'>) {
  return (
    <svg
      className={cn('light:text-primary dark:text-white', className)}
      width={width}
      height={height}
      viewBox="0 0 132 132"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M6 6L66 86L126 6M6 126L66 46L126 126"
        stroke="currentColor"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
