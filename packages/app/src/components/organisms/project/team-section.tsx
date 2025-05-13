import type { FCWithClassName } from '@/types'
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

export const ProjectTeamSection: FCWithClassName = ({ className = '' }) => (
  <section className={className}>
    <header className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Team</h2>
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
    </header>
    <TeamTable />
  </section>
)
