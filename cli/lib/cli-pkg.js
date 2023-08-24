import { readFileSync } from 'node:fs'

export const cliPkg = JSON.parse(
  readFileSync(
    new URL('../package.json', import.meta.url),
    'utf8'
  )
)
