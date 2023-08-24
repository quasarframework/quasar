import { existsSync } from 'node:fs'

export function createInstance ({ appPaths }) {
  return (
    appPaths.quasarConfigFilename.endsWith('.ts')
    && existsSync(appPaths.resolve.app('tsconfig.json'))
  )
}
