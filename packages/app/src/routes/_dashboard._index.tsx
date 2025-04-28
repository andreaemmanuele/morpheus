import { loadDefaultProject } from '@/loaders/projects'
import { createProject } from '@/actions/projects/create'
import { CreateProjectForm } from '@/components/forms/create-project-form'

export const loader = loadDefaultProject
export const action = createProject

export default function NewProjectPage() {
  return (
    <div className="grid place-items-center pt-12">
      <div className="w-full max-w-xl space-y-8 border-1 border-input rounded-lg p-8">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">Your First Project</h1>
          <p className="text-sm font-light">
            Instantly create your project in a few steps.
          </p>
        </header>
        <CreateProjectForm />
      </div>
    </div>
  )
}
