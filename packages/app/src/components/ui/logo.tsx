import { ComponentProps } from 'react'

export function Logo({ width, height, ...props }: ComponentProps<'svg'>) {
  return (
    <svg
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
        stroke-width="12"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
