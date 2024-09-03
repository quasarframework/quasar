import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { readFileSync } from 'node:fs'

export const cliDir = fileURLToPath(new URL('../..', import.meta.url))
export function resolveToCliDir (dir) {
  return join(cliDir, dir)
}

export const cliPkg = JSON.parse(
  readFileSync(
    new URL('../../package.json', import.meta.url),
    'utf-8'
  )
)
