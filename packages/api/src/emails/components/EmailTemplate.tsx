import React, { FC, ReactNode } from 'react'
import { Header } from './Header'

type EmailTemplateProps = {
  title: string
  content: ReactNode
}

export const EmailTemplate: FC<EmailTemplateProps> = ({
  title = '',
  content = '',
}) => {
  return (
    <html>
      <head>
        <style>
          {`
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            background: #f8f8f8;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
          }
          .content {
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
            font-size: 18px;
          }
          .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 100px
          }
        `}
        </style>
      </head>
      <Header title={title} />
      <body>
        <div className="container">
          <div className="content">
            <div className="section">{content}</div>
          </div>
          <footer className="footer">
            <p>
              Morpheus &copy; {new Date().getFullYear()}. All rights reserved.
            </p>
          </footer>
        </div>
      </body>
    </html>
  )
}
