import { useActionData, useNavigation } from '@remix-run/react'
import { AlertCircle } from 'lucide-react'
import { guestRouteGuardLoader } from '@/loaders/auth'
import { joinProjectAction } from '@/actions/projects/join'
import { JoinProjectForm } from '@/components/forms/join-project-form'
import { Alert } from '@/components/atoms/alert'

export const loader = guestRouteGuardLoader
export const action = joinProjectAction

export default function JoinProjectPage() {
  const data = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting'

  return (
    <>
      {data && !isSubmitting && (
        <Alert
          title="Error"
          description={data.error ?? ''}
          icon={<AlertCircle className="h-4 w-4" />}
        />
      )}
      <JoinProjectForm submitting={isSubmitting} />
    </>
  )
}
