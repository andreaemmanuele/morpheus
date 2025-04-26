import type { FC } from 'react'
import { useFetcher } from '@remix-run/react'
import { Button } from '@/components/ui/button'
import { Moon } from '@/components/atoms/moon'

type ThemeSwitcherProps = {
  current: 'light' | 'dark'
}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = ({ current }) => {
  const fetcher = useFetcher()

  const toggleTheme = () => {
    const formData = new FormData()
    formData.set('theme', current === 'light' ? 'dark' : 'light')
    fetcher.submit(formData, {
      method: 'post',
      action: '/action/set-theme',
    })
  }

  return (
    <Button
      className="relative text-black group dark:text-white bg-transparent shadow-none hover:bg-transparent"
      onClick={toggleTheme}
    >
      <Moon active={current === 'dark'} />
      <div className="absolute top-0 w-8 h-8 bg-lime-100 blur-2xl -z-10" />
    </Button>
  )
}
