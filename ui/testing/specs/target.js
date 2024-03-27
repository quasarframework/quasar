import { fileURLToPath } from 'node:url'
import fglob from 'fast-glob'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

export function getTargetList (argv) {
  const exceptionFileRE = /test|index\.js$|__/

  return fglob.sync(
    [ `src/**/${ argv.target || '*' }.js` ],
    { cwd: rootFolder }
  ).filter(
    file => exceptionFileRE.test(file) === false
  )
}
