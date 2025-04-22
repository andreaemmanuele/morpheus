import React from 'react'
import { FC, ReactNode } from 'react'

type ButtonProps = { href: string; children: ReactNode }

export const Button: FC<ButtonProps> = ({ href = '', children }) => {
  return (
    <>
      <style>
        {`
          a { background: #051937;
            color: white;
            font-weight: 600;
            text-decoration: none;
            letter-spacing: 1.1px;
            padding: 15px 30px;
            border: none;
            border-radius: 10px;
          }
      `}
      </style>
      <a href={href}>{children}</a>
    </>
  )
}
