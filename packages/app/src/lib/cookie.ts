import type { Cookie } from '@remix-run/server-runtime'

export const deleteCookie = (cookie: Cookie) =>
  cookie.serialize(null, {
    maxAge: 0,
    expires: new Date(0),
  })
