export type AccessToken = {
  id: number
  email: string
  username: string
  refreshToken: string
  iat: number
  exp: number
}

export type Session = {
  accessToken: string
  refreshToken: string
  refreshTokenExpired: boolean
  user: {
    id: number
    email: string
    username: string
    defaultProject: string
  }
}
