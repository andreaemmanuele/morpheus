import type { AlertProps } from '@/components/ui/alert'
import type { ReactNode } from 'react'
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

export function Alert({ title = '', description = '', variant, icon }: Props) {
  return (
    <UIAlert variant={variant}>
      {icon && icon}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </UIAlert>
  )
}
