import { defineConfig } from '@morphe.us/shared/chore'

export default defineConfig({
  storage: {
    driver: 'local',
    publicPath: '/uploads',
    enabled: true,
  },
})
