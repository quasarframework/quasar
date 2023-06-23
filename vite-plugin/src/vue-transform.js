
import { join } from 'node:path'
import { readFileSync } from 'node:fs'
import importTransformation from 'quasar/dist/transforms/import-transformation.js'

import { mapQuasarImports, removeQuasarImports } from './js-transform.js'
import { quasarPath } from './quasar-path.js'

const autoImportData = JSON.parse(
  readFileSync(join(quasarPath, 'dist/transforms/auto-import.json'), 'utf-8')
)

const compRegex = {
  kebab: new RegExp(`_resolveComponent\\("${ autoImportData.regex.kebabComponents }"\\)`, 'g'),
  pascal: new RegExp(`_resolveComponent\\("${ autoImportData.regex.pascalComponents }"\\)`, 'g'),
  combined: new RegExp(`_resolveComponent\\("${ autoImportData.regex.components }"\\)`, 'g')
}

const dirRegex = new RegExp(`_resolveDirective\\("${ autoImportData.regex.directives.replace(/v-/g, '') }"\\)`, 'g')
const lengthSortFn = (a, b) => b.length - a.length

export function vueTransform (content, autoImportComponentCase, useTreeshaking) {
  const importSet = new Set()
  const importMap = {}

  const compList = []
  const dirList = []

  const reverseMap = {}
  const jsImportTransformed = useTreeshaking === true
    ? mapQuasarImports(content, importMap)
    : removeQuasarImports(content, importMap, importSet, reverseMap)

  let code = jsImportTransformed
    .replace(compRegex[ autoImportComponentCase ], (_, match) => {
      const name = autoImportData.importName[ match ]
      const reverseName = match.replace(/-/g, '_')

      if (importMap[ name ] === void 0) {
        importSet.add(name)
        reverseMap[ reverseName ] = name
      }
      else {
        reverseMap[ reverseName ] = importMap[ name ]
      }

      compList.push(reverseName)
      return ''
    })
    .replace(dirRegex, (_, match) => {
      const name = autoImportData.importName[ 'v-' + match ]
      const reverseName = match.replace(/-/g, '_')

      if (importMap[ name ] === void 0) {
        importSet.add(name)
        reverseMap[ reverseName ] = name
      }
      else {
        reverseMap[ reverseName ] = importMap[ name ]
      }

      dirList.push(reverseName)
      return ''
    })

  if (compList.length !== 0) {
    const list = compList.sort(lengthSortFn).join('|')
    code = code
      .replace(new RegExp(`const _component_(${ list }) = `, 'g'), '')
      .replace(new RegExp(`_component_(${ list })`, 'g'), (_, match) => reverseMap[ match ])
  }

  if (dirList.length !== 0) {
    const list = dirList.sort(lengthSortFn).join('|')
    code = code
      .replace(new RegExp(`const _directive_(${ list }) = `, 'g'), '')
      .replace(new RegExp(`_directive_(${ list })`, 'g'), (_, match) => reverseMap[ match ])
  }

  if (importSet.size === 0) {
    return code
  }

  const importList = [ ...importSet ]
  const codePrefix = useTreeshaking === true
    ? importList.map(name => `import ${ name } from '${ importTransformation(name) }'`).join(';')
    : `import {${ importList.join(',') }} from 'quasar'`

  return codePrefix + ';' + code
}
