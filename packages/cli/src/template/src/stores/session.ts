import { create } from 'zustand'
import type { Session } from '../../server/types'

type SessionStore = {
  session: Session | null
  setSession: (data: Session) => void
}

export const sessionStore = create<SessionStore>()((set) => ({
  session: null,
  setSession: (data) => set(() => ({ session: data })),
}))
