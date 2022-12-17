const { join } = require('path')
const { sync: fgSync } = require('fast-glob')

const moduleIdRE = /^examples:/
const resolvedIdPrefix = '\0examples:'

const targetFolder = join(__dirname, '../public/examples')

function devLoad (id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const folder = id.substring(id.indexOf(':') + 1)
    return `export const code = import.meta.globEager('./public/examples/${folder}/*.vue')` +
      `\nexport const source = import.meta.globEager('./public/examples/${folder}/*.vue', { as: 'raw' })`
  }
}

function prodLoad (id) {
  if (id.startsWith(resolvedIdPrefix) === true) {
    const exampleId = id.substring(id.indexOf(':') + 1)
    const files = fgSync(join(targetFolder, exampleId, '/*.vue'))

    const localFolder = join(targetFolder, exampleId) + '/'
    const localFolderLen = localFolder.length

    const importNameList = new Set()
    const importStatements = files.map(entry => {
      const importName = entry.substring(localFolderLen, entry.length - 4)
      importNameList.add(importName)
      return `import ${importName} from 'app/public/examples/${exampleId}/${importName}.vue'` +
        `\n// import Raw${importName} from 'app/public/examples/${exampleId}/${importName}.vue?raw'`
    }).join('\n')

    if (id.indexOf('frameless-electron') !== -1) {
      console.log('\n-------')
      console.log(id)
      console.log('------')
      console.log(importStatements +
        `\nexport const code = {${Array.from(importNameList).join(',')}}` +
        `\nexport const source = {${Array.from(importNameList).map(entry => `${entry}:Raw${entry}`).join(',')}}`)
    }
    return importStatements +
      `\nexport const code = {${Array.from(importNameList).join(',')}}` +
      `\nexport const source = {}// {${Array.from(importNameList).map(entry => `${entry}:Raw${entry}`).join(',')}}`
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
