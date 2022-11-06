import autoImportData from 'quasar/dist/transforms/auto-import.json'
import importTransformation from 'quasar/dist/transforms/import-transformation.js'

import { mapQuasarImports, fillQuasarImports } from './js-transform.js'

const compRegex = {
  'kebab': new RegExp(`_resolveComponent\\("${autoImportData.regex.kebabComponents}"\\)`, 'g'),
  'pascal': new RegExp(`_resolveComponent\\("${autoImportData.regex.pascalComponents}"\\)`, 'g'),
  'combined': new RegExp(`_resolveComponent\\("${autoImportData.regex.components}"\\)`, 'g')
}

const dirRegex = new RegExp(`_resolveDirective\\("${autoImportData.regex.directives.replace(/v-/g, '')}"\\)`, 'g')
const lengthSortFn = (a, b) => b.length - a.length

export function vueTransform (content, autoImportComponentCase, useTreeshaking) {
  const importList = []
  const importMap = {}

  const compList = []
  const dirList = []

  const reverseMap = {}
  const jsImportTransformed = useTreeshaking === true
    ? mapQuasarImports(content, importMap)
    : fillQuasarImports(content, importMap)

  let code = jsImportTransformed
    .replace(compRegex[autoImportComponentCase], (_, match) => {
      const name = autoImportData.importName[match]
      const reverseName = match.replace(/-/g, '_')

      if (importMap[name] === void 0) {
        importList.push( name )
        reverseMap[reverseName] = name
      }
      else {
        reverseMap[reverseName] = importMap[name]
      }

      compList.push(reverseName)
      return ''
    })
    .replace(dirRegex, (_, match) => {
      const name = autoImportData.importName['v-' + match]
      const reverseName = match.replace(/-/g, '_')

      if (importMap[name] === void 0) {
        importList.push( name )
        reverseMap[reverseName] = name
      }
      else {
        reverseMap[reverseName] = importMap[name]
      }

      dirList.push(reverseName)
      return ''
    })

  if (importList.length === 0) {
    return code
  }

  if (compList.length > 0) {
    const list = compList.sort(lengthSortFn).join('|')
    code = code
      .replace(new RegExp(`const _component_(${list}) = `, 'g'), '')
      .replace(new RegExp(`_component_(${list})`, 'g'), (_, match) => reverseMap[match])
  }

  if (dirList.length > 0) {
    const list = dirList.sort(lengthSortFn).join('|')
    code = code
      .replace(new RegExp(`const _directive_(${list}) = `, 'g'), '')
      .replace(new RegExp(`_directive_(${list})`, 'g'), (_, match) => reverseMap[match])
  }

  const codePrefix = useTreeshaking === true
    ? importList.map(name => `import ${name} from '${importTransformation(name)}'`).join(`;`)
    : `import {${importList.join(',')}} from 'quasar'`

  return codePrefix + ';' + code
}
