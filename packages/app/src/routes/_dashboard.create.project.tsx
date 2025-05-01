import { CreateProjectForm } from '@/components/forms/create-project-form'
import { createProjectAction } from '@/actions/projects/create'
import { useNavigation } from '@remix-run/react'

export const action = createProjectAction

export default function NewProjectPage() {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'
  return (
    <div className="grid place-items-center pt-12">
      <div className="w-full max-w-xl space-y-8 border-1 border-input rounded-lg p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">New Project</h1>
          <p className="text-sm font-light">
            Instantly create your project in a few steps.
          </p>
        </header>
        <CreateProjectForm submitting={isSubmitting} />
      </div>
    </div>
  )
}
