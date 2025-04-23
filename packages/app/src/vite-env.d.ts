/// <reference types="vite/client" />

declare module '@tailwindcss/vite' {
  import { Plugin } from 'vite'
  const tailwindcss: (options?: unknown) => Plugin
  export default tailwindcss
}

declare module '@/components/*' {
  export { Logo } from './components/ui/logo.tsx'
  export { Label } from './components/ui/label.tsx'
  export { Input } from './components/ui/input.tsx'
  export { Button } from './components/ui/button.tsx'
  export { LoginForm } from './components/login-form.tsx'
}

declare module '@/lib/utils' {
  export { cn } from './lib/utils.ts'
}
