import crypto from 'crypto'

export const generateRandomToken = () => crypto.randomBytes(40).toString('hex')

export const getIfTokenIsExpired = (expiresAt: string | number) => {
  if (!expiresAt) return true
  const currentDate = new Date()
  const expirationDate = new Date(expiresAt)
  return expirationDate.getTime() <= currentDate.getTime()
}
