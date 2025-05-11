import type { FC, ReactNode } from 'react'
import type { Project } from '@/components/molecules/project-switcher'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/organisms/app-sidebar'
import { ThemeSwitcher } from '@/components/atoms/theme-switcher'
import { Breadcrumb } from '@/components/molecules/breadcrumb'

type DashboardTemplateProps = {
  projects: Project[]
  children: ReactNode
  theme: 'dark' | 'light'
  sidebarOpen?: boolean
  disableSidebar?: boolean
}

export const DashboardTemplate: FC<DashboardTemplateProps> = ({
  projects = [],
  theme,
  children,
  sidebarOpen = false,
  disableSidebar = false,
}) => {
  return (
    <SidebarProvider defaultOpen={sidebarOpen}>
      <AppSidebar projects={projects} variant="inset" />
      <SidebarInset>
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" disabled={disableSidebar} />
            <Separator orientation="vertical" className="mr-2 !h-4" />
            <Breadcrumb />
          </div>
          <ThemeSwitcher current={theme} />
        </header>
        <div className="px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
