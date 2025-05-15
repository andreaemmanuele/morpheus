import type { FCWithClassName } from '@/types'
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

const deleteWord = 'CLEAR'

export const ProjectSecuritySection: FCWithClassName = ({ className = '' }) => {
  const [deleteConfirmWord, setDeleteConfirmWord] = useState('')
  const [openDelete, setOpenDelete] = useState(false)
  const { project } = projectStore()

  const fetcher = useFetcher()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  const deleteProject = () => {
    if (!project) return
    fetcher.submit(
      { slug: project.slug },
      {
        method: 'DELETE',
        action: '/action/projects/delete',
      }
    )
    setOpenDelete(false)
  }

  return (
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
        <Dialog open={openDelete} onOpenChange={setOpenDelete}>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete project</Button>
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
