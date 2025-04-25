import { jsx as _jsx } from 'react/jsx-runtime'
export const Button = ({ href = '', children }) =>
  _jsx('a', {
    style: {
      background: '#051937',
      color: 'white',
      fontWeight: 600,
      textDecoration: 'none',
      letterSpacing: '1.1px',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '10px',
    },
    href: href,
    children: children,
  })
