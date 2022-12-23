const { join } = require('path')
const { sync: fgSync } = require('fast-glob')

const moduleIdRE = /^examples:/
const resolvedIdPrefix = '\0examples:'

const targetFolder = join(__dirname, '../src/examples')

function devLoad (id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const folder = id.substring(id.indexOf(':') + 1)
    return `export const code = import.meta.globEager('./src/examples/${folder}/*.vue')` +
      `\nexport const source = import.meta.globEager('./src/examples/${folder}/*.vue', { as: 'raw' })`
  }
}

function prodLoad (id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const exampleId = id.substring(id.indexOf(':') + 1)
    const files = fgSync(join(targetFolder, exampleId, '/*.vue'))

    const localFolder = join(targetFolder, exampleId) + '/'
    const localFolderLen = localFolder.length

    const importList = files.map(entry => entry.substring(localFolderLen, entry.length - 4))
    const importStatements = importList
      .map(entry => (
        `import ${entry} from 'app/src/examples/${exampleId}/${entry}.vue'` +
        `\nimport Raw${entry} from 'app/src/examples/${exampleId}/${entry}.vue?raw'`
      ))
      .join('\n')

    const exportStatements = importList
      .map(entry => `${ entry },Raw${ entry }`)
      .join(',')

    return importStatements + `\nexport {${ exportStatements }}`
  }
}

module.exports = isProd => ({
  name: 'docs-examples',

  resolveId (id) {
    if (moduleIdRE.test(id) === true) {
      return '\0' + id
    }
  },

  load: isProd === true ? prodLoad : devLoad
})
