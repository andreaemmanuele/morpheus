import type { FC, ReactNode } from 'react'

type ContainerProps = {
  children: ReactNode
}

export const Container: FC<ContainerProps> = ({ children }) => (
  <div
    style={{
      maxWidth: '600px',
      margin: '0 auto',
    }}
  >
    {children}
  </div>
)
