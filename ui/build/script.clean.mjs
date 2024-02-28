import { fileURLToPath } from 'node:url'
import { sync as rimrafSync } from 'rimraf'

rimrafSync(
  fileURLToPath(new URL('../dist/*', import.meta.url))
)

console.log(' 💥 Cleaned build artifacts.\n')
