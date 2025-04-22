import React, { FC } from 'react'

type HeaderProps = { title: string }

export const Header: FC<HeaderProps> = ({ title = '' }) => {
  return (
    <>
      <style>
        {`
        header {
            background-color: #fff;
            display: flex-col;
            border-bottom: 1px solid #EAEAEA;
        }
        h1 {
          font-size: 35px;
          color: #000;
          line-height: 1;
          margin: 0;
          margin-top: 20px;
        }
        `}
      </style>
      <header>
        <div className="container">
          <div className="content">
            <img
              width="160px"
              src="https://res.cloudinary.com/dnftznvvt/image/upload/v1745334024/morpheus-logo_s5qfxz.png"
              alt=""
            />
            <h1>{title}</h1>
          </div>
        </div>
      </header>
    </>
  )
}
