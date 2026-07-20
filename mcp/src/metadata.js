import { readFileSync } from 'node:fs'
import { URL } from 'node:url'

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

export const serverMetadata = Object.freeze({
  name: packageJson.name,
  version: packageJson.version
})
