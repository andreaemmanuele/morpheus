type Messages = 'account-unlocked' | 'token-invalid'

export const renderAlertMessage = (message: string) => {
  const messages: Record<Messages, string> = {
    'account-unlocked': 'Your account has been unlocked. Login now.',
    'token-invalid':
      'You already unlocked your account. If not, account still suspended.',
  }
  return messages[message as Messages] ?? null
}
