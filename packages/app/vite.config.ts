import { vitePlugin as remix } from '@remix-run/dev'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

declare module '@remix-run/server-runtime' {
  interface Future {
    unstable_singleFetch: true
  }
}

export default defineConfig({
  plugins: [
    remix({
      appDirectory: './src',
      future: {
        unstable_singleFetch: true,
      },
    }),
    tsconfigPaths(),
    tailwindcss(),
  ],
})
