
import { readFileSync } from 'node:fs'

export const packageJson = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')
)
