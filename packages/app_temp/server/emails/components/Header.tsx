import type { FC } from 'react'
import { Container } from './Container'
import { Content } from './Content'

type HeaderProps = { title: string }

export const Header: FC<HeaderProps> = ({ title = '' }) => (
  <header
    style={{
      backgroundColor: '#FFF',
      borderBottom: '1px solid #EAEAEA',
    }}
  >
    <Container>
      <Content>
        <img
          width="160px"
          src="https://res.cloudinary.com/dnftznvvt/image/upload/v1745334024/morpheus-logo_s5qfxz.png"
          alt=""
        />
        <h1
          style={{
            fontSize: '35px',
            color: '#000',
            lineHeight: 1,
            margin: '15px 0 0 0',
          }}
        >
          {title}
        </h1>
      </Content>
    </Container>
  </header>
)
