import type { FCWithClassName, TeamMember } from '@/types'
import { useEffect, useState } from 'react'
import { useFetcher, useNavigation } from '@remix-run/react'
import { LoaderCircle } from 'lucide-react'
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
import { projectStore } from '@/stores/project'

type ProjectTeamSectionProps = {
  members: TeamMember[]
}

export const ProjectTeamSection: FCWithClassName<ProjectTeamSectionProps> = ({
  className = '',
  members,
}) => {
  const [email, setEmail] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] =
    useState(false)
  const { project } = projectStore()

  const fetcher = useFetcher()
  const isSubmitting = fetcher.state !== 'idle'

  const inviteMember = () => {
    fetcher.submit(
      { name: project?.name ?? '', slug: project?.slug ?? '', email },
      {
        method: 'POST',
        action: '/action/projects/invite-member',
      }
    )
  }

  const deleteMember = (id: number | null) => {
    fetcher.submit(
      { id },
      {
        method: 'POST',
        action: '/action/projects/delete-member',
      }
    )
  }

  useEffect(() => {
    if (isSubmitting) return
    setIsDeleteMemberDialogOpen(false)
    setIsInviteDialogOpen(false)
    setEmail('')
  }, [isSubmitting])

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
          <Dialog
            open={isInviteDialogOpen}
            onOpenChange={setIsInviteDialogOpen}
          >
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
                  value={email}
                  placeholder="m@example.com"
                  className="col-span-3"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button type="submit" onClick={inviteMember}>
                  {isSubmitting ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    'Send invite'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <TeamTable
        data={members}
        emailFilter={emailFilter}
        isDeleteMemberDialogOpen={isDeleteMemberDialogOpen}
        isDeletingMember={isSubmitting}
        onSetDeleteMemberDialog={setIsDeleteMemberDialogOpen}
        onDelete={deleteMember}
      />
    </section>
  )
}
