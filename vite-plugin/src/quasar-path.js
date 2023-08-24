
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

const require = createRequire(import.meta.url)

export const quasarPath = dirname(require.resolve('quasar/package.json'))
