import { Form } from '@remix-run/react'
import { Image } from 'lucide-react'
import { TeamTable } from '@/components/organisms/team-table'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { projectStore } from '@/stores/project'
import { renderIcon } from '@/lib/icons'

export default function ProjectSettingsPage() {
  const { project } = projectStore()
  return (
    <div className="flex flex-col pb-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      <section className="space-y-8 pt-12">
        <div className="flex gap-x-8 max-w-[36rem]">
          <div className="relative group">
            <button className="absolute inset-0 opacity-0 grid group-hover:opacity-100 duration-300 transition-opacity bg-gray-400/30 rounded-full z-10 place-items-center">
              <Image />
            </button>
            <Avatar className="w-24 h-24">
              <AvatarImage src="" alt="" />
              <AvatarFallback className="group-hover:opacity-0 transition-opacity duration-300">
                {renderIcon(project?.icon ?? 'pill')}
              </AvatarFallback>
            </Avatar>
          </div>
          <Form className="flex flex-col gap-y-2 flex-1">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input defaultValue={project?.name} required />
            </div>
            <Button
              type="submit"
              className="ml-auto"
              variant="secondary"
              size="sm"
            >
              Change name
            </Button>
          </Form>
        </div>
      </section>
      <section className="space-y-8 pt-12">
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
      <section className="space-y-8 pt-12">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Security</h2>
        </header>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              This action is irreversible. Enter "
              <span className="font-bold">CLEAR</span>" to confirm.
            </DialogDescription>
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                confirm word
              </Label>
              <Input id="confirm-word" />
            </div>
            <DialogFooter>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}
