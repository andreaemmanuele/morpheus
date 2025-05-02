import type { FC, ReactNode } from 'react'

type ContentProps = {
  children: ReactNode
}

export const Content: FC<ContentProps> = ({ children }) => (
  <div
    style={{
      padding: '30px',
    }}
  >
    {children}
  </div>
)
