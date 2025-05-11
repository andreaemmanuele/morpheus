import type { FC } from 'react'
import type { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/molecules/data-table'

type TeamMember = {
  id: string
  email: string
  status: 'pending' | 'active'
  role: 'owner' | 'admin' | 'editor'
}

export const columns: ColumnDef<TeamMember>[] = [
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'actions',
    cell: () => <div>a</div>,
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

export const TeamTable: FC = () => {
  return <DataTable columns={columns} data={data} />
}
