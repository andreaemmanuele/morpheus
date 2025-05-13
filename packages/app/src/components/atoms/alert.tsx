'use client'

import type { AlertProps } from '@/components/ui/alert'
import type { FC, ReactNode } from 'react'
import {
  Alert as UIAlert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'

type Props = {
  title: string
  description: string
  icon: ReactNode
} & AlertProps

export const Alert: FC<Props> = ({
  title = '',
  description = '',
  variant,
  icon,
}) => (
  <UIAlert className="animate-in fade-in-0 duration-300 ease" variant={variant}>
    {icon && icon}
    <AlertTitle>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </UIAlert>
)
