import type { ActionFunctionArgs } from '@remix-run/server-runtime'
import { useNavigation } from '@remix-run/react'
import { defaultProjectLoader } from '@/loaders/projects'
import { createProjectAction } from '@/actions/projects/create'
import { CreateProjectForm } from '@/components/forms/create-project-form'
import { breadcrumbStore } from '@/stores/breadcrumb'
import { useEffect } from 'react'

export const loader = defaultProjectLoader
export const action = async (data: ActionFunctionArgs) => {
  const isFirstProject = true
  return createProjectAction(data, isFirstProject)
}

export default function NewProjectPage() {
  const { setBreadcrumb } = breadcrumbStore()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  useEffect(() => {
    setBreadcrumb([{ id: 1, name: 'Create Your First Project' }])
  }, [])

  return (
    <div className="grid place-items-center pt-12">
      <div className="w-full max-w-xl space-y-8 border-1 border-input rounded-lg p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Your First Project</h1>
          <p className="text-sm font-light">
            Instantly create your project in a few steps.
          </p>
        </header>
        <CreateProjectForm submitting={isSubmitting} />
      </div>
    </div>
  )
}
