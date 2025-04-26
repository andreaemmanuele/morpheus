import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
