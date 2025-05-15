import type { Project } from '../../server/types'

export const getAllProjects = async (
  token: string
): Promise<Project[] | null> => {
  let response
  try {
    response = await fetch(`${process.env.BASE_URL}/api/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(error)
  }

  if (response?.ok) return await response?.json()
  return null
}

export const getProject = async (token: string, slug: string) => {
  let response
  try {
    response = await fetch(`${process.env.BASE_URL}/api/projects/${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  } catch (error) {
    console.error(error)
  }

  if (response?.ok) return await response?.json()
  return null
}

export const getProjectTeamMembers = async (token: string, slug: string) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/team`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
  }
  if (!response?.ok) return { members: [] }
  const result = await response.json()
  return { members: result }
}

export const deleteProject = async (token: string, slug: string) => {
  const response = await fetch(`${process.env.BASE_URL}/api/projects/${slug}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response?.ok) throw new Error('Failed to delete project')
}
