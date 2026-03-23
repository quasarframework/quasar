import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globSync } from 'tinyglobby'

const moduleIdRE = /^examples:/
const resolvedIdPrefix = '\0examples:'

const targetFolder = fileURLToPath(new URL('../src/examples', import.meta.url))

function devLoad(id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const query = `'/src/examples/${id.substring(id.indexOf(':') + 1)}/*.vue'`
    return (
      `export const code = import.meta.glob(${query}, { eager: true })` +
      `\nexport const source = import.meta.glob(${query}, { query: '?raw', import: 'default', eager: true })`
    )
  }
}

function prodLoad(id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const exampleId = id.substring(id.indexOf(':') + 1)
    const files = globSync('*.vue', { cwd: join(targetFolder, exampleId) })

    const importList = files.map(entry => entry.substring(0, entry.length - 4))
    const importStatements = importList
      .map(
        entry =>
          `import ${entry} from 'app/src/examples/${exampleId}/${entry}.vue'` +
          `\nimport Raw${entry} from 'app/src/examples/${exampleId}/${entry}.vue?raw'`
      )
      .join('\n')

    const exportStatements = importList
      .map(entry => `${entry},Raw${entry}`)
      .join(',')

    return importStatements + `\nexport {${exportStatements}}`
  }
}

export default function examplesPlugin(isProd) {
  return {
    name: 'docs-examples',

    resolveId(id) {
      if (moduleIdRE.test(id) === true) {
        return '\0' + id
      }
    },

    load: isProd === true ? prodLoad : devLoad
  }
}
