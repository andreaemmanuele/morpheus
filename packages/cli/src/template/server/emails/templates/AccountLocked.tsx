import type { FC } from 'react'
import { EmailTemplate } from '../components/EmailTemplate.js'
import { Button } from '../components/Button.js'

type AccountLockedProps = {
  token: string
}

export const AccountLocked: FC<AccountLockedProps> = ({ token = '' }) => (
  <EmailTemplate
    title="ACCOUNT SUSPENDED"
    content={
      <>
        <p>
          Your account has been blocked for <strong>suspicious activity</strong>
          . If it wasn't you, please, unlock your account by clicking the button
          below.
        </p>
        <p>We recommend strongly to change your password.</p>
        <div style={{ paddingTop: '50px' }}>
          <Button
            href={`${process.env.BASE_URL}/api/auth/unlock-account/${token}`}
          >
            Unlock your account
          </Button>
        </div>
      </>
    }
  />
)
