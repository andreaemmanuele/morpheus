export const getAllProjects = async (token: string) => {
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
