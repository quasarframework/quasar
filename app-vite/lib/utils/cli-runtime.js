import { join, normalize } from 'node:path'

export { default as cliPkg } from '../../package.json' with { type: 'json' }

export const cliDir = normalize(join(import.meta.dirname, '../..'))

export function resolveToCliDir(dir) {
  return join(cliDir, dir)
}
