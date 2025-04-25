import { jsx as _jsx } from 'react/jsx-runtime'
export const Container = ({ children }) =>
  _jsx('div', {
    style: {
      maxWidth: '600px',
      margin: '0 auto',
    },
    children: children,
  })
