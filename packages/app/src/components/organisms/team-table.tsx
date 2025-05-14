import type { FC } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { TeamMember } from '@/types'
import { useEffect } from 'react'
import { useState } from 'react'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { MoreVerticalIcon, UserX } from 'lucide-react'
import { DataTable } from '@/components/molecules/data-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { clsx } from 'clsx'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const columns: ColumnDef<TeamMember>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.role !== 'owner' && (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'User Role',
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="px-1.5 text-muted-foreground">
          {row.original.role}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={clsx({
          'bg-green-400 dark:bg-green-700': row.original.status === 'active',
          'bg-gray-300 dark:bg-gray-400': row.original.status === 'pending',
        })}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => (
      <div className="flex justify-end">
        {row.original.role !== 'owner' && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost">
                <MoreVerticalIcon className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src="" alt="" />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {row.original.email}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {row.original.role}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button
                  type="button"
                  className="w-full"
                  variant="destructive"
                  size="sm"
                  onClick={() => {}}
                >
                  <UserX />
                  Remove from team
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    ),
  },
]

const data: TeamMember[] = [
  {
    id: '1',
    email: 'andrea@mono.studio',
    status: 'active',
    role: 'owner',
  },
  {
    id: '2',
    email: 'email@example.com',
    status: 'pending',
    role: 'admin',
  },
  {
    id: '3',
    email: 'email@example.com',
    status: 'pending',
    role: 'editor',
  },
  {
    id: '4',
    email: 'email@example.com',
    status: 'pending',
    role: 'editor',
  },
  {
    id: '5',
    email: 'email@example.com',
    status: 'pending',
    role: 'editor',
  },
  {
    id: '6',
    email: 'email@example.com',
    status: 'pending',
    role: 'editor',
  },
  {
    id: '7',
    email: 'email@example.com',
    status: 'pending',
    role: 'editor',
  },
]

type TeamTableProps = {
  emailFilter: string
}

export const TeamTable: FC<TeamTableProps> = ({ emailFilter }) => {
  const [rowSelection, setRowSelection] = useState({})
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  useEffect(() => {
    table.getColumn('email')?.setFilterValue(emailFilter)
  }, [emailFilter])

  return <DataTable table={table} columns={columns} />
}
