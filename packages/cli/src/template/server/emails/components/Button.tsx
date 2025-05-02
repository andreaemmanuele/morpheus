import type { FC, ReactNode } from 'react'

type ButtonProps = { href: string; children: ReactNode }

export const Button: FC<ButtonProps> = ({ href = '', children }) => (
  <a
    style={{
      background: '#051937',
      color: 'white',
      fontWeight: 600,
      textDecoration: 'none',
      letterSpacing: '1.1px',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '10px',
    }}
    href={href}
  >
    {children}
  </a>
)
