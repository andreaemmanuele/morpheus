import type { FCWithClassName, TeamMember } from '@/types'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TeamTable } from '@/components/organisms/team-table'

type ProjectTeamSectionProps = {
  members: TeamMember[]
}

export const ProjectTeamSection: FCWithClassName<ProjectTeamSectionProps> = ({
  className = '',
  members,
}) => {
  const [emailFilter, setEmailFilter] = useState('')
  return (
    <section className={className}>
      <header className="flex items-center gap-x-4">
        <h2 className="text-2xl font-semibold">Team</h2>
        <div className="flex flex-1 gap-x-4 justify-end">
          <Input
            placeholder="Search user by email"
            value={emailFilter}
            className="max-w-sm"
            onChange={(event) => {
              setEmailFilter(event.target.value)
            }}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Add member</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Invite New Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button type="submit">Send invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <TeamTable data={members} emailFilter={emailFilter} />
    </section>
  )
}
