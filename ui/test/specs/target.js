import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'

const rootFolder = normalize(join(import.meta.dirname, '../..'))

export function getTargetList(argv) {
  const exceptionFileRE = /test|index\.js$|__|\.fixtures\.js$/
  const targetList = argv.target
    ? [
        `src/**/${argv.target}.js`,
        `src/${argv.target}/**/*.js`,
        `src/**/*${argv.target}*.js`
      ]
    : ['src/**/*.js']

  return globSync(targetList, { cwd: rootFolder }).filter(
    file => !exceptionFileRE.test(file)
  )
}
