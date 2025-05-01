import type { AppConfig } from '@remix-run/dev/dist/config'
import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    remix({
      appDirectory: './src',
      future: {
        unstable_singleFetch: true,
      } as AppConfig['future'],
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@morpheus/shared': resolve(__dirname, '../shared/src'),
    },
  },
})
