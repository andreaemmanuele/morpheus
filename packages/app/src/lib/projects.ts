import type { Project } from '@/server/types'
import type { CreateProjectData, ProjectDetails } from '@/types'

export const createProject = async (
  token: string,
  data: CreateProjectData
): Promise<ProjectDetails | null> => {
  let response
  try {
    response = await fetch(`${process.env.BASE_URL}/api/projects/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
  } catch (e) {
    console.error(e)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const inviteMembers = async (
  token: string,
  projectName: string,
  slug: string,
  emails: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName,
          invites: emails,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const joinProject = async (
  token: string,
  projectId: string,
  username: string,
  password: string,
  confirmPassword: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${projectId}/join`,
      {
        method: 'POST',
        body: JSON.stringify({
          token,
          username,
          password,
          confirmPassword,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  const result = await response?.json()
  if (!response?.ok) return { error: result.error }
  return result
}

export const leaveProject = async (token: string, slug: string) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/leave`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

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

export const getPerCategoryProjectFiles = async (
  token: string,
  slug: string,
  category: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/files/${category}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return []
  return await response?.json()
}

export const updateProject = async (
  token: string,
  slug: string,
  icon?: string | null,
  picture?: string | null,
  name?: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/update`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          icon,
          picture,
          name,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const updateMemberRole = async (
  token: string,
  slug: string,
  roleId: string,
  userId: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/update-role`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roleId,
          userId,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const updateOwner = async (
  token: string,
  slug: string,
  userId: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/transfer`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const associateFilesToProject = async (
  token: string,
  slug: string,
  fileIds: number[],
  category: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/files`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileIds,
          category,
        }),
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const deleteTeamMember = async (
  token: string,
  slug: string,
  id: string
) => {
  let response
  try {
    response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}/member/${id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  } catch (error) {
    console.error(error)
  }

  if (!response?.ok) return null
  return await response?.json()
}

export const deleteProject = async (token: string, slug: string) => {
  try {
    const response = await fetch(
      `${process.env.BASE_URL}/api/projects/${slug}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    if (!response?.ok) throw new Error('Failed to delete project')
  } catch (error) {
    console.error(error)
  }
}
