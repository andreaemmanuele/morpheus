export const getAllRoles = async (token: string) => {
  try {
    const response = await fetch(`${process.env.BASE_URL}/api/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) return []
    return await response.json()
  } catch (error) {
    console.error(error)
    return []
  }
}
