import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseSync } from 'vite'

import { quasarPath } from './quasar-path.js'

let quasarImportMap
export function loadQuasarImportMap() {
  if (quasarImportMap !== void 0) return

  try {
    quasarImportMap = JSON.parse(
      readFileSync(join(quasarPath, 'dist/transforms/import-map.json'), 'utf8')
    )
  } catch (err) {
    throw new Error('Failed to load Quasar import map', { cause: err })
  }
}

const importQuasarRegex = /import\s*\{([^}]*)\}\s*from\s*(['"])quasar\2;?/g
const stripCommentsRegex = /\/\*[\s\S]*?\*\/|\/\/.*/g

/**
 * Textual pre-filter for imports (or exports) from the "quasar" package
 * that survived the transformations — static, re-export or dynamic form.
 * Can false-positive on string content (e.g. documentation snippets),
 * so a match must be confirmed by hasResidualQuasarImports().
 */
export const residualQuasarImportRegex =
  /from\s*(['"])quasar\1|import\s*\(\s*(['"])quasar\2\s*\)/

const dynamicResidualRegex = /import\s*\(\s*(['"])quasar\1\s*\)/

const staticQuasarImportNodeTypes = new Set([
  'ImportDeclaration',
  'ExportNamedDeclaration',
  'ExportAllDeclaration'
])

const scriptLangRegex = /\.([jt]sx?|[cm][jt]s)$/
const scriptLangAliases = { mjs: 'js', cjs: 'js', mts: 'ts', cts: 'ts' }

/**
 * The parser infers the dialect from the filename, but module ids can
 * carry queries (SFC sub-requests end in "lang.<ext>", plain files may
 * have "?t=..." appended), so the dialect is resolved here and passed
 * explicitly. Unknown extensions parse as plain JS, in which case
 * unparsable content falls back to trusting the textual match.
 */
function inferScriptLang(id) {
  const match =
    scriptLangRegex.exec(id) ?? scriptLangRegex.exec(id.split('?', 2)[0])

  if (match === null) return 'js'
  return scriptLangAliases[match[1]] ?? match[1]
}

/**
 * TS type-only imports/exports are erased at transpile time, so they
 * never pull the Quasar bundle into the build output.
 */
function isTypeOnlyNode(node) {
  if (node.importKind === 'type' || node.exportKind === 'type') {
    return true
  }

  const specifiers = node.specifiers
  return (
    specifiers !== void 0 &&
    specifiers.length !== 0 &&
    specifiers.every(
      entry => entry.importKind === 'type' || entry.exportKind === 'type'
    )
  )
}

function containsQuasarDynamicImport(node) {
  if (Array.isArray(node)) {
    return node.some(containsQuasarDynamicImport)
  }
  if (node === null || typeof node !== 'object') {
    return false
  }

  if (
    node.type === 'ImportExpression' &&
    node.source?.type === 'Literal' &&
    node.source.value === 'quasar'
  ) {
    return true
  }

  for (const key in node) {
    if (key === 'type' || key === 'start' || key === 'end') continue
    if (containsQuasarDynamicImport(node[key])) return true
  }

  return false
}

/**
 * Exact detection of an import (or export) from the "quasar" package
 * that survived the transformations; in a production build it resolves
 * to the full Quasar bundle, which silently bloats the app since the
 * bundle is not imported through per-file paths anymore.
 * The AST parse only runs when the cheap textual pre-filter matches,
 * and weeds out its false positives (import statements appearing within
 * string content, like documentation code snippets).
 */
export function hasResidualQuasarImports(code, id = 'unknown.js') {
  if (!residualQuasarImportRegex.test(code)) {
    return false
  }

  let program
  try {
    const result = parseSync(id, code, { lang: inferScriptLang(id) })
    if (result.errors.length !== 0) {
      // unparsable code; trust the textual match
      return true
    }
    program = result.program
  } catch {
    return true
  }

  // static imports and re-exports are always top-level
  for (const node of program.body) {
    if (
      staticQuasarImportNodeTypes.has(node.type) &&
      node.source?.value === 'quasar' &&
      !isTypeOnlyNode(node)
    ) {
      return true
    }
  }

  // dynamic import("quasar") can appear anywhere, but the full AST
  // walk is only worth it when its textual form is present at all
  return (
    dynamicResidualRegex.test(code) &&
    containsQuasarDynamicImport(program.body) === true
  )
}

export function importTransformation(importName) {
  const file = quasarImportMap[importName]
  if (file === void 0) {
    throw new Error('Unknown import from Quasar: ' + importName)
  }
  return 'quasar/' + file
}

function countNewlines(str) {
  let acc = 0
  let index = -1

  while ((index = str.indexOf('\n', index + 1)) !== -1) {
    acc++
  }

  return acc
}

/**
 * Transforms JS code where importing from 'quasar' package
 * Example:
 *       import { QBtn } from 'quasar'
 *    -> import QBtn from 'quasar/src/components/QBtn.js'
 *
 * The replacement spans the same number of lines as the original
 * statement, so positions in the rest of the file remain valid
 * without requiring a source map.
 */
export function mapQuasarImports(code, importMap = {}) {
  return code.replace(
    importQuasarRegex,
    (fullMatch, match) =>
      match
        .replace(stripCommentsRegex, '')
        .split(',')
        .map(identifier => {
          const data = identifier.split(' as ')
          const importName = data[0].trim()

          // might be an empty entry like below
          // (notice useQuasar is followed by a comma)
          // import { QTable, useQuasar, } from 'quasar'
          if (importName === '') {
            return ''
          }

          const importAs = data[1] !== void 0 ? data[1].trim() : importName

          importMap[importName] = importAs
          return `import ${importAs} from '${importTransformation(importName)}';`
        })
        .join('') + '\n'.repeat(countNewlines(fullMatch))
  )
}

/**
 * Transforms JS code where importing from 'quasar' package
 * Example:
 *       import { QBtn } from 'quasar'
 *    -> add to importMap & importList & remove original import statement
 *    (removing original is required so that the end file will have
 *     only one import from Quasar statement)
 *
 * The removal keeps the original statement's newlines in place, so
 * positions in the rest of the file remain valid without a source map.
 */
export function removeQuasarImports(code, importMap, importSet, reverseMap) {
  return code.replace(importQuasarRegex, (fullMatch, match) => {
    match
      .replace(stripCommentsRegex, '')
      .split(',')
      .forEach(identifier => {
        const data = identifier.split(' as ')
        const importName = data[0].trim()

        // might be an empty entry like below
        // (notice useQuasar is followed by a comma)
        // import { QTable, useQuasar, } from 'quasar'
        if (importName !== '') {
          const importAs = data[1] !== void 0 ? data[1].trim() : importName

          importSet.add(
            importName + (importAs !== importName ? ` as ${importAs}` : '')
          )
          importMap[importName] = importAs
          reverseMap[importName.replaceAll('-', '_')] = importAs
        }
      })

    // we registered the original import and we
    // remove this one to avoid duplicate imports from Quasar
    return '\n'.repeat(countNewlines(fullMatch))
  })
}
