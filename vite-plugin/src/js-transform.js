import importTransformation from 'quasar/dist/transforms/import-transformation.js'

const importQuasarRegex = /import\s*\{([\w,\s]+)\}\s*from\s*(['"])quasar\2;?/g

/**
 * Transforms JS code where importing from 'quasar' package
 * Example:
 *       import { QBtn } from 'quasar'
 *    -> import QBtn from 'quasar/src/components/QBtn.js'
 */
export function mapQuasarImports (code, importMap = {}) {
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
