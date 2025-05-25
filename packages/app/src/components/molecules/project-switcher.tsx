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
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export type Project = {
  name: string
  slug: string
  logo: Icons
  picture: string
  url: string
}

type ProjectSwitcherProps = {
  items: Project[]
  active: string | undefined
}

export function ProjectSwitcher({ items, active }: ProjectSwitcherProps) {
  const { isMobile } = useSidebar()
  const [activeProject, setActiveProject] = React.useState(items[0] ?? null)

  useEffect(() => {
    if (!active || !items.length) return
    setActiveProject((prev) => {
      const project = items.find(({ slug }) => slug === active) ?? items[0]
      if (!project) return null
      return { ...prev, ...project }
    })
  }, [active, items])

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="aspect-square size-10 rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <AvatarImage
                  className="object-cover object-center bg-transparent"
                  src={activeProject?.picture}
                  alt={activeProject?.name}
                />
                <AvatarFallback className="bg-transparent">
                  {renderIcon(activeProject?.logo ?? 'pill')}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeProject?.name}
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
                  <Avatar className="h-6 w-6 rounded-sm border">
                    <AvatarImage
                      className="object-cover object-center bg-transparent"
                      src={project.picture}
                      alt={project.name}
                    />
                    <AvatarFallback className="bg-transparent">
                      {renderIcon(project.logo)}
                    </AvatarFallback>
                  </Avatar>
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
