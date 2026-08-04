import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const quasarPath = dirname(
  fileURLToPath(import.meta.resolve('quasar/package.json'))
)
