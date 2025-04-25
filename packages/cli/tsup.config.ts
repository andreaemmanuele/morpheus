import { defineConfig } from 'tsup'
import { resolve } from 'path'

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/index.ts', 'src/utils/**/*.ts'],
  format: ['esm'],
  sourcemap: true,
  minify: true,
  target: 'esnext',
  outDir: 'dist',
  treeshake: true,
  esbuildOptions(options) {
    options.alias = {
      '@': resolve(__dirname, './'),
    }
  },
})
