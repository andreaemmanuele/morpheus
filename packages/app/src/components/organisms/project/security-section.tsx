import type { FCWithClassName, TeamMember } from '@/types'
import { useState } from 'react'
import { useFetcher, useNavigation } from '@remix-run/react'
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
import { LoaderCircle } from 'lucide-react'
import { projectStore } from '@/stores/project'
import { useUserHasPermission } from '@/hooks/use-user-has-permission'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const transferWord = 'TRANSFER'
const deleteWord = 'CLEAR'

type ProjectSecuritySectionProps = {
  members: TeamMember[]
}

export const ProjectSecuritySection: FCWithClassName<
  ProjectSecuritySectionProps
> = ({ className = '', members = [] }) => {
  const { hasPermission: canLeave } = useUserHasPermission('project.leave')
  const { hasPermission: canDelete } = useUserHasPermission('project.delete')
  const { hasPermission: canTransfer } =
    useUserHasPermission('project.transfer')

  const [transferTo, setTransferTo] = useState('')
  const [transferConfirmWord, setTransferConfirmWord] = useState('')
  const [deleteConfirmWord, setDeleteConfirmWord] = useState('')
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false)
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { project } = projectStore()

  const fetcher = useFetcher()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const leaveProject = () => {
    if (!canLeave) return
    fetcher.submit(
      { slug: project?.slug ?? '' },
      {
        method: 'DELETE',
        action: '/action/projects/leave',
      }
    )
    setIsLeaveDialogOpen(false)
  }

  const transferOwnership = () => {
    if (!canTransfer) return
    fetcher.submit(
      { slug: project?.slug ?? '', userId: transferTo },
      {
        method: 'POST',
        action: '/action/projects/transfer',
      }
    )
    setIsTransferDialogOpen(false)
  }

  const deleteProject = () => {
    if (!canDelete) return
    fetcher.submit(
      { slug: project?.slug ?? '' },
      {
        method: 'DELETE',
        action: '/action/projects/delete',
      }
    )
    setIsDeleteDialogOpen(false)
  }

  return (
    <section className={className}>
      <header className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Security</h2>
      </header>
      <div className="flex items-start flex-col gap-y-2">
        <Dialog open={isLeaveDialogOpen} onOpenChange={setIsLeaveDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" disabled={!canLeave}>
              Leave Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Are you sure?</DialogTitle>
            </DialogHeader>
            <DialogDescription>This action is irreversible.</DialogDescription>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button
                type="submit"
                className="mt-2 sm:mt-0"
                variant="destructive"
                onClick={leaveProject}
              >
                Leave
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isTransferDialogOpen}
          onOpenChange={setIsTransferDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="secondary" disabled={!canTransfer}>
              Transfer ownership
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Transfer ownership</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              This action is irreversible. Enter "
              <span className="font-bold">{transferWord}</span>" to confirm.
            </DialogDescription>
            <div className="space-y-4">
              <Label className="sr-only" htmlFor="role">
                Member
              </Label>
              <Select
                value={transferTo}
                onValueChange={(e) => {
                  setTransferTo(e)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map(({ id, email }) => (
                    <SelectItem value={`${id}`}>{email}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="space-y-2">
                <Label htmlFor="confirm-word">Confirm</Label>
                <Input
                  id="confirm-word"
                  value={transferConfirmWord}
                  required
                  onChange={(e) => {
                    setTransferConfirmWord(e.target.value)
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                disabled={
                  !transferTo ||
                  transferConfirmWord.toLowerCase() !==
                    transferWord.toLowerCase()
                }
                onClick={transferOwnership}
              >
                Transfer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" disabled={!canDelete}>
              Delete project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              This action is irreversible. Enter "
              <span className="font-bold">{deleteWord}</span>" to confirm.
            </DialogDescription>
            <div className="space-y-2">
              <Label htmlFor="email" className="sr-only">
                confirm word
              </Label>
              <Input
                id="confirm-word"
                value={deleteConfirmWord}
                onChange={(e) => setDeleteConfirmWord(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button
                type="submit"
                variant="destructive"
                onClick={deleteProject}
                disabled={
                  deleteConfirmWord.toLowerCase() !== deleteWord.toLowerCase()
                }
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
