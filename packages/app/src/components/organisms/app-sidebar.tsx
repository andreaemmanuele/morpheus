'use client'

import type { Project } from '@/components/molecules/project-switcher'
import * as React from 'react'
import {
  BarChartIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  SettingsIcon,
  UsersIcon,
  BookOpen,
  SquareTerminal,
} from 'lucide-react'

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

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: LayoutDashboardIcon,
    },
    {
      title: 'Lifecycle',
      url: '#',
      icon: ListIcon,
    },
    {
      title: 'Analytics',
      url: '#',
      icon: BarChartIcon,
    },
    {
      title: 'Projects',
      url: '#',
      icon: FolderIcon,
    },
    {
      title: 'Team',
      url: '#',
      icon: UsersIcon,
    },
  ],
  navSecondary: [
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
      url: '#',
      icon: SettingsIcon,
    },
  ],
}

type AppSidebarProps = {
  projects: Project[]
} & React.ComponentProps<typeof Sidebar>

export function AppSidebar({ projects, ...props }: AppSidebarProps) {
  const { session } = sessionStore()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ProjectSwitcher items={projects} />
      </SidebarHeader>
      <SidebarContent>
        {/*<NavMain items={data.navMain} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
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
