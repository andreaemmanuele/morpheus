import type { FC } from 'react'
import { EmailTemplate } from '../components/EmailTemplate.js'
import { Button } from '../components/Button.js'

type RecoverPasswordProps = {
  token: string
}

export const RecoverPassword: FC<RecoverPasswordProps> = ({ token = '' }) => (
  <EmailTemplate
    title="RECOVER PASSWORD"
    content={
      <>
        <p>
          You have request to recover your password. Click the button below.
        </p>
        <p>If it wasn't you, please, ignore this email.</p>
        <div style={{ paddingTop: '50px' }}>
          <Button
            href={`${process.env.BASE_URL}/reset-password/?token=${token}`}
          >
            Reset your password
          </Button>
        </div>
      </>
    }
  />
)
