'use client'

import type { Icons } from '@/lib/icons'
import { renderIcon } from '@/lib/icons'
import * as React from 'react'
import { ChevronsUpDown, Plus } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { NavLink } from '@remix-run/react'

export type Project = {
  name: string
  logo: Icons
  url: string
}

type ProjectSwitcherProps = {
  items: Project[]
}

export function ProjectSwitcher({ items }: ProjectSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeProject, setActiveProject] = React.useState(items[0])

  if (!activeProject) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                {renderIcon(activeProject.logo)}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProject.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Projects
            </DropdownMenuLabel>
            {items.map((project, index) => (
              <DropdownMenuItem
                key={project.name}
                onClick={() => setActiveProject(project)}
              >
                <NavLink
                  className="flex items-center gap-2 p-2 w-full"
                  to={project.url}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <div className="size-4 shrink-0">
                      {renderIcon(activeProject.logo)}
                    </div>
                  </div>
                  {project.name}
                  <DropdownMenuShortcut className="ml-auto">
                    ⌘{index + 1}
                  </DropdownMenuShortcut>
                </NavLink>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <NavLink
                className="flex items-center p-2 gap-2 w-full h-full"
                to="/create/project"
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add project
                </div>
              </NavLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
