'use client'

import type { Project } from '@/components/molecules/project-switcher'
import * as React from 'react'
import { SettingsIcon, BookOpen, SquareTerminal, Files } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { ProjectSwitcher } from '@/components/molecules/project-switcher'
import { NavSecondary } from '@/components/molecules/nav-secondary'
import { NavUser } from '@/components/molecules/nav-user'
import { sessionStore } from '@/stores/session'
import { projectStore } from '@/stores/project'
import { NavMain } from '@/components/molecules/nav-main'

type AppSidebarProps = {
  projects: Project[]
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ projects, ...props }: AppSidebarProps) {
  const { session } = sessionStore()
  const { project } = projectStore()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ProjectSwitcher items={projects} active={project?.slug} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={[
            {
              title: 'Media',
              url: `/${project?.slug}/media`,
              icon: Files,
            },
          ]}
        />
        <NavSecondary
          items={[
            {
              title: 'Playground',
              url: '#',
              icon: SquareTerminal,
            },
            {
              title: 'Documentation',
              url: '#',
              icon: BookOpen,
            },
            {
              title: 'Settings',
              url: `/${project?.slug}/settings`,
              icon: SettingsIcon,
            },
          ]}
          className="mt-auto"
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: session?.user.email ?? '',
            name: session?.user.username ?? '',
            avatar: '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
