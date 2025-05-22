import type { FC, MouseEvent } from 'react'
import { useState } from 'react'
import { useFetcher } from '@remix-run/react'
import { Button } from '@/components/ui/button'
import { Moon } from '@/components/atoms/moon'
import { getSystemPreferredTheme } from '@/lib/utils'

type ThemeSwitcherProps = {
  current: 'light' | 'dark'
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ current }) => {
  const fetcher = useFetcher()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const toggleTheme = () => {
    const formData = new FormData()
    formData.set('theme', current === 'light' ? 'dark' : 'light')
    fetcher.submit(formData, {
      method: 'post',
      action: '/action/set-theme',
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    setPosition((prev) => ({
      ...prev,
      x: window.innerWidth - e.clientX,
      y: e.clientY,
    }))
  }

  const handleMouseLeave = (e: MouseEvent) => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <Button
      className="relative w-[5rem] h-[5rem] text-black group dark:text-white bg-transparent shadow-none hover:bg-transparent"
      onClick={toggleTheme}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Moon
        active={
          !current ? getSystemPreferredTheme() === 'dark' : current === 'dark'
        }
      />
      <div
        style={{ transform: `translate(-${position.x}px, ${position.y}px)` }}
        className="absolute top-0 right-2 w-8 h-8 bg-lime-100 blur-2xl transition-transform duration-100 ease-linear"
      />
    </Button>
  )
}
