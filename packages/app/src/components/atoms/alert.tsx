'use client'

import type { AlertProps } from '@/components/ui/alert'
import type { FC, ReactNode } from 'react'
import {
  Alert as UIAlert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { Fade } from '@/components/animations/fade'

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
  <Fade>
    <UIAlert variant={variant}>
      {icon && icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </UIAlert>
  </Fade>
)
