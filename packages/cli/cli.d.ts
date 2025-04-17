declare module 'api/src/queries' {
  export { queries } from 'api/src/queries'
}

declare module '@/src/utils/db' {
  interface Database {
    // eslint-disable-next-line
    query: (text: string, params: any[]) => Promise<any>
    end: () => Promise<void>
  }

  const db: Database
  export default db
}

declare module '@/src/*' {
  export { createUser } from './src/commands/create-user'
  export { loadEnv } from './src/utils/env'
  export { handleError } from './src/utils/errors'
}
