/// <reference types="vite/client" />

declare module '@tailwindcss/vite' {
  import { Plugin } from 'vite'
  const tailwindcss: (options?: unknown) => Plugin
  export default tailwindcss
}

declare module '@react-router/dev/vite' {
  import { Plugin } from 'vite'
  const reactRouter: (options?: unknown) => Plugin
  export type RouteConfig = Record<string, unknown>
  export { reactRouter }
}

declare module '@/components/login-form' {
  export { LoginForm } from './components/login-form.tsx'
}

declare module '@/components/ui/logo' {
  export { Logo } from './components/ui/logo.tsx'
}

declare module '@/components/ui/label' {
  export { Label } from './components/ui/label.tsx'
}

declare module '@/components/ui/input' {
  export { Input } from './components/ui/input.tsx'
}

declare module '@/components/ui/button' {
  export { Button } from './components/ui/button.tsx'
}

declare module '@/lib/utils' {
  export { cn } from './lib/utils.ts'
}
