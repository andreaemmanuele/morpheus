import type { FC } from 'react'
import { useFetcher } from '@remix-run/react'
import { Button } from '@/components/ui/button'

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

  return <Button onClick={toggleTheme}>toggle</Button>
}
