import { existsSync } from 'node:fs'

export function createInstance({ appPaths }) {
  return existsSync(appPaths.resolve.app('tsconfig.json'))
}
