import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const getRandomLetters = (str: string, min = 2) => {
  const getStringPosition = (str: string) => {
    const max = str.length - 1
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  const getLettersDifferentPosition = () => {
    const pos1 = getStringPosition(str)
    const pos2 = getStringPosition(str)
    if (pos1 === pos2) return getLettersDifferentPosition()
    return [pos1, pos2]
  }

  const [pos1, pos2] = getLettersDifferentPosition()
  if (!pos1 || !pos2) return ''

  return `${str[pos1]}${str[pos2]}`
}

export const getSystemPreferredTheme = () => {
  if (typeof window === 'undefined') return
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = isDark ? 'dark' : 'light'
  const cookieValue = isDark ? 'ImRhcmsi' : 'ImxpZ2h0Ig=='
  document.body?.classList.add(theme)
  document.cookie = 'theme=' + cookieValue + ';path=/;'
  return theme
}
