import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

const importMap = JSON.parse(
  readFileSync(
    join(quasarPath, 'dist/transforms/import-map.json'),
    'utf-8'
  )
)

const importQuasarRegex = /import\s*\{([\w,\s]+)\}\s*from\s*(['"])quasar\2;?/g

export function importTransformation (importName) {
  const file = importMap[ importName ]
  if (file === void 0) {
    throw new Error('Unknown import from Quasar: ' + importName)
  }
  return 'quasar/' + file
}

/**
 * Transforms JS code where importing from 'quasar' package
 * Example:
 *       import { QBtn } from 'quasar'
 *    -> import QBtn from 'quasar/src/components/QBtn.js'
 */
export function mapQuasarImports (code, importMap = {}) {
  return code.replace(
    importQuasarRegex,
    (_, match) => match
      .split(',')
      .map(identifier => {
        const data = identifier.split(' as ')
        const importName = data[ 0 ].trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (importName === '') {
          return ''
        }

        const importAs = data[ 1 ] !== void 0
          ? data[ 1 ].trim()
          : importName

        importMap[ importName ] = importAs
        return `import ${ importAs } from '${ importTransformation(importName) }';`
      })
      .join('')
  )
}

/**
 * Transforms JS code where importing from 'quasar' package
 * Example:
 *       import { QBtn } from 'quasar'
 *    -> add to importMap & importList & remove original import statement
 *    (removing original is required so that the end file will have
 *     only one import from Quasar statement)
 */
export function removeQuasarImports (code, importMap, importSet, reverseMap) {
  return code.replace(
    importQuasarRegex,
    (_, match) => {
      match.split(',').forEach(identifier => {
        const data = identifier.split(' as ')
        const importName = data[ 0 ].trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (importName !== '') {
          const importAs = data[ 1 ] !== void 0
            ? data[ 1 ].trim()
            : importName

          importSet.add(importName + (importAs !== importName ? ` as ${ importAs }` : ''))
          importMap[ importName ] = importAs
          reverseMap[ importName.replace(/-/g, '_') ] = importAs
        }
      })

      // we registered the original import and we
      // remove this one to avoid duplicate imports from Quasar
      return ''
    }
  )
}
