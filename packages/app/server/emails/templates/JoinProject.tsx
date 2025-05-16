import type { FC } from 'react'
import { EmailTemplate } from '../components/EmailTemplate.js'
import { Button } from '../components/Button.js'

type JoinProjectProps = {
  name: string
  token: string
}

export const JoinProject: FC<JoinProjectProps> = ({ name, token = '' }) => (
  <EmailTemplate
    title="JOIN PROJECT"
    content={
      <>
        <p>{`You have been invited to be part of ${name}'s team.`}</p>
        <div style={{ paddingTop: '50px' }}>
          <Button href={`${process.env.BASE_URL}/projects/join/${token}`}>
            Join now
          </Button>
        </div>
      </>
    }
  />
)
