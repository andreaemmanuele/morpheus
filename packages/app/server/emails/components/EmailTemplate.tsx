import type { FC, ReactNode } from 'react'
import { Header } from './Header.js'
import { Container } from './Container.js'
import { Content } from './Content.js'

type EmailTemplateProps = {
  title: string
  content: ReactNode
}

export const EmailTemplate: FC<EmailTemplateProps> = ({
  title = '',
  content = '',
}) => (
  <html>
    <Header title={title} />
    <body
      style={{
        fontFamily: 'Arial, sans-serif',
        lineHeight: 1.6,
        background: '#f8f8f8',
        color: '#333',
        margin: 0,
        padding: 0,
      }}
    >
      <Container>
        <Content>
          <div
            style={{
              marginBottom: '25px',
              fontSize: '18px',
            }}
          >
            {content}
          </div>
        </Content>
        <footer
          style={{
            textAlign: 'center',
            fontSize: '12px',
            color: '#666',
            marginTop: '100px',
            paddingBottom: '20px',
          }}
        >
          <p>
            Morpheus &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
        </footer>
      </Container>
    </body>
  </html>
)
