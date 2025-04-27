import type { FC } from 'react'
import { cn } from '@/lib/utils'

type MoonProps = {
  active: boolean
}

export const Moon: FC<MoonProps> = ({ active }) => (
  <svg
    className="size-6 [&_.ray]:transition-all [&_.ray]:duration-500 [&_.ray]:ease-[linear(0_0%,-0.21_38.45%,_1.3_62.81%,_1_100%)]"
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      className={cn(
        'origin-center transition-transform duration-300 ease-[linear(0_0%,-0.21_38.45%,_1.3_62.81%,_1_100%)]',
        {
          'scale-[2.5]': active,
        }
      )}
      d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"
      strokeWidth="1"
    />
    <path
      className={cn('ray', {
        'translate-y-1 opacity-0': active,
      })}
      d="M12 2v2"
    />
    <path
      className={cn('ray ', { '-translate-y-1 opacity-0': active })}
      d="M12 20v2"
    />
    <path
      className={cn('ray', {
        'translate-y-1 -rotate-12 opacity-0': active,
      })}
      d="m4.9 4.9 1.4 1.4"
    />
    <path
      className={cn('ray', {
        '-translate-y-1 rotate-12 opacity-0': active,
      })}
      d="m17.7 17.7 1.4 1.4"
    />
    <path
      className={cn('ray', { 'translate-x-1 opacity-0': active })}
      d="M2 12h2"
    />
    <path
      className={cn('ray', { '-translate-x-1 opacity-0': active })}
      d="M20 12h2"
    />
    <path
      className={cn('ray', {
        '-translate-y-1 -rotate-12 opacity-0': active,
      })}
      d="m6.3 17.7-1.4 1.4"
    />
    <path
      className={cn('ray', {
        '-translate-y-1 rotate-12 opacity-0': active,
      })}
      d="m19.1 4.9-1.4 1.4"
    />
  </svg>
)
