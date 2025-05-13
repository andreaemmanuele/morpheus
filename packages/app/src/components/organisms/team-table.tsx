import type { FC } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import type { TeamMember } from '@/types'
import { MoreVerticalIcon } from 'lucide-react'
import { DataTable } from '@/components/molecules/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { clsx } from 'clsx'
import { Checkbox } from '@/components/ui/checkbox'

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
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
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
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
        </DropdownMenu>
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

export const TeamTable: FC = () => <DataTable columns={columns} data={data} />
