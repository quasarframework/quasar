import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const rootFolder = fileURLToPath(new URL('..', import.meta.url))
const resolve = file => join(rootFolder, file)

export default {
  input: resolve('src/index.js'),
  output: {
    file: resolve('dist/index.cjs'),
    format: 'cjs'
  },
  external: [
    'vite',
    /quasar[\\/][dist|package.json]/,
    /node:/
  ]
}
