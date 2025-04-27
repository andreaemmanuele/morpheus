'use client'

import * as React from 'react'
import {
  AudioWaveform,
  BarChartIcon,
  ClipboardListIcon,
  Command,
  DatabaseIcon,
  FileIcon,
  FolderIcon,
  GalleryVerticalEnd,
  HelpCircleIcon,
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
  projects: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
    },
    {
      name: 'Evil Corp.',
      logo: Command,
    },
  ],
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { session } = sessionStore()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ProjectSwitcher items={data.projects} />
      </SidebarHeader>
      <SidebarContent>
        {/*<NavMain items={data.navMain} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            email: session?.email ?? '',
            name: session?.username ?? '',
            avatar: '',
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
