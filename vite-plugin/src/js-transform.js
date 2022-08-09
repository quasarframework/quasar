import importTransformation from 'quasar/dist/transforms/import-transformation.js'

const importQuasarRegex = /import\s*\{([\w,\s]+)\}\s*from\s*(['"])quasar\2;?/g

export function jsDevTransform (code) {
  return code.replace(
    importQuasarRegex,
    (_, match) => `import {${match}} from 'quasar/dist/quasar.esm.js'`
  )
}

export function jsProdTransform (code, importMap = {}) {
  return code.replace(
    importQuasarRegex,
    (_, match) => match.split(',')
      .map(identifier => {
        const data = identifier.split(' as ')
        const importName = data[0].trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (importName === '') {
          return ''
        }

        const importAs = data[1] !== void 0
          ? data[1].trim()
          : importName

        importMap[importName] = importAs
        return `import ${ importAs } from '${ importTransformation(importName) }';`
      })
      .join('')
  )
}
