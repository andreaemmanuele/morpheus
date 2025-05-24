export const getConfig = async () => {
  try {
    const config = await import('morpheus.config')
    return config.default
  } catch (error) {
    console.error('Config file not found', error)
  }
}
