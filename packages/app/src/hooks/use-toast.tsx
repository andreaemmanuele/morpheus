import { useEffect } from 'react'
import { toast } from 'sonner'

const clearCookie = () => {
  document.cookie = `toast=''; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`
}

export const useToast = (data: { toast?: string }) => {
  useEffect(() => {
    const message = data.toast
    if (!message) return
    toast(message, { duration: 3000 })
    setTimeout(clearCookie)
  }, [data])
}
