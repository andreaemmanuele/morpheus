type FileStorage = {
  driver: 'local' | 's3' | 'cloudinary'
  publicPath: string
  enabled: boolean
  fileSize?: number
}

type Config = { storage: FileStorage }

export const defineConfig = (config: Config) => ({
  ...config,
})
