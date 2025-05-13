import type { FCWithClassName } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export const ProjectSecuritySection: FCWithClassName = ({ className = '' }) => (
  <section className={className}>
    <header className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Security</h2>
    </header>
    <div className="flex items-start flex-col gap-y-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary">Transfer ownership</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer ownership</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            This action is irreversible. Enter "
            <span className="font-bold">TRANSFER</span>" to confirm.
          </DialogDescription>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
            <Label htmlFor="confirm-word">Confirm</Label>
            <Input id="confirm-word" required />
          </div>
          <DialogFooter>
            <Button type="submit" variant="destructive">
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    </div>
  </section>
)
