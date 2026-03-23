import { fileURLToPath } from 'node:url'
import { globSync } from 'tinyglobby'

const rootFolder = fileURLToPath(new URL('../..', import.meta.url))

export function getTargetList(argv) {
  const exceptionFileRE = /test|index\.js$|__/
  const targetList = argv.target
    ? [
        `src/**/${argv.target}.js`,
        `src/${argv.target}/**/*.js`,
        `src/**/*${argv.target}*.js`
      ]
    : ['src/**/*.js']

  return globSync(targetList, { cwd: rootFolder }).filter(
    file => exceptionFileRE.test(file) === false
  )
}
