import importTransformation from 'quasar/dist/transforms/import-transformation.js'

export const importQuasarRegex = /import\s*\{([\w,\s]+)\}\s*from\s*['"]{1}quasar['"]{1}/
export const jsTransformRegex = /\.[j|t]s$/

export function jsTransform (code) {
  return code.replace(
    importQuasarRegex,
    (_, match) => match.split(',')
      .map(identifier => {
        const id = identifier.trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (id === '') {
          return ''
        }

        const data = id.split(' as ')
        const importName = data[0].trim()
        const importAs = data[1] !== void 0
          ? data[1].trim()
          : importName

        return `import ${importAs} from '${importTransformation(importName)}'\n`
      })
      .join('')
  )
}
