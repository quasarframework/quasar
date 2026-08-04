import { createHash } from 'node:crypto'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import {
  buildVariablesGraph,
  loadPrecomputedQuasarVariables,
  resolveVariablesClosure
} from './sass-variables-graph.js'

/**
 * Matches sass constructs through which an injected file could supply
 * anything beyond plain variable definitions to the target style content:
 * mixins, functions, placeholder selectors or transitively loaded files.
 * Built-in "sass:*" modules only offer namespaced members, so they are fine.
 */
const nonVariableDefRegex =
  /@(?:mixin|function|import|forward)\b|@use\s+(?!['"]sass:)|%[a-zA-Z_]/

export function areVariablesDefinitionsOnly(sassVariables) {
  // the precomputed parse shipped by the Quasar UI build (guaranteed by
  // the peer dependency floor) is the proof that its own variables file
  // is definitions-only; without it (broken install), always inject
  if (loadPrecomputedQuasarVariables() === null) {
    return false
  }

  if (typeof sassVariables !== 'string') {
    return true
  }

  try {
    return (
      nonVariableDefRegex.test(readFileSync(sassVariables, 'utf8')) === false
    )
  } catch {
    return false
  }
}

/**
 * Holds the variables graph and keeps it fresh: a custom variables file
 * can be edited during dev, so its stat signature is re-checked on every
 * transform (a sub-microsecond operation) and the graph is rebuilt when
 * it changes. Also emits the content-addressed "closure files" that the
 * targeted injection imports.
 */
export function createVariablesManager(sassVariables) {
  const isCustomFile = typeof sassVariables === 'string'

  let cacheDir = join(tmpdir(), 'quasar-vite-plugin')
  let cacheDirReady = false
  let statKey = null
  let canSkipInjection = false
  let graph = null

  function getStatKey() {
    try {
      const stat = statSync(sassVariables)
      return stat.mtimeMs + ':' + stat.size
    } catch {
      return 'missing'
    }
  }

  function rebuild() {
    canSkipInjection = areVariablesDefinitionsOnly(sassVariables)
    graph =
      canSkipInjection === true ? buildVariablesGraph(sassVariables) : null
  }

  return {
    // the app's node_modules/.cache is preferred over the tmpdir default
    setCacheRoot(rootDir) {
      cacheDir = join(rootDir, 'node_modules', '.cache', 'quasar-vite-plugin')
      cacheDirReady = false
    },

    refresh() {
      const key = isCustomFile === true ? getStatKey() : 'static'
      if (key !== statKey) {
        statKey = key
        rebuild()
      }
    },

    get canSkipInjection() {
      return canSkipInjection
    },
    get graph() {
      return graph
    },

    /**
     * Writes the closure declarations into a content-addressed scss file
     * (a separate sass module, so its "@use sass:*" statements cannot
     * collide with the target content's own) and returns its import path.
     * Returns null when the file cannot be written, in which case full
     * injection is used instead.
     */
    getClosureImportPath({ declarations, usesNamespace }) {
      const statements =
        usesNamespace === true
          ? [
              ...graph.namespaces.map(ns => `@use 'sass:${ns}'`),
              ...declarations
            ]
          : declarations
      const content = statements.map(entry => entry + ';').join('\n') + '\n'

      const hash = createHash('sha1').update(content).digest('hex').slice(0, 16)
      const file = join(cacheDir, `vars-${hash}.scss`)

      try {
        if (cacheDirReady === false) {
          mkdirSync(cacheDir, { recursive: true })
          cacheDirReady = true
        }
        if (existsSync(file) === false) {
          writeFileSync(file, content)
        }
      } catch {
        return null
      }

      return file.replaceAll('\\', '/')
    }
  }
}

/**
 * Content loading other stylesheets (except built-in "sass:*" modules)
 * can propagate the injected variables into them through @import
 * semantics, so the injection cannot be skipped for it.
 */
const contentLoadsFilesRegex = /@(?:import|use|forward)\s+(?!['"]sass:)/
const varRefRegex = /\$([\w-]+)/g

/**
 * A source map that only shifts lines: identity mappings around
 * `insertCount` unmapped lines at `insertLine`.
 */
function lineShiftMap(id, source, insertLine, insertCount) {
  const parts = []
  let mappedAny = false

  const identity = () => {
    const segment = mappedAny === false ? 'AAAA' : 'AACA'
    mappedAny = true
    return segment
  }

  for (let i = 0; i < insertLine; i++) parts.push(identity())
  for (let i = 0; i < insertCount; i++) parts.push('')

  const remaining = source.split('\n').length - insertLine
  for (let i = 0; i < remaining; i++) parts.push(identity())

  return {
    version: 3,
    sources: [id],
    sourcesContent: [source],
    names: [],
    mappings: parts.join(';')
  }
}

export function createScssTransform(fileExtension, sassVariables, manager) {
  const importList = ["'quasar/src/css/variables.sass'"]

  if (typeof sassVariables === 'string') {
    importList.unshift(`'${sassVariables}'`)
  }

  const isIndented = fileExtension === 'sass'

  // A single statement so that the line offset it introduces is constant
  // and minimal: zero lines for scss, exactly one line for sass
  // (the indented syntax requires a statement to end with a newline)
  const fullPrefix = isIndented
    ? `@import ${importList.join(', ')}\n`
    : `@import ${importList.join(', ')};`

  const getTargetedPrefix = content => {
    const refNames = new Set()
    for (const match of content.matchAll(varRefRegex)) {
      refNames.add(match[1])
    }

    // content defines/uses only its own variables
    if (refNames.size === 0) return ''

    const closure = resolveVariablesClosure(manager.graph, refNames)
    if (closure.declarations.length === 0) return ''

    const importPath = manager.getClosureImportPath(closure)
    if (importPath === null) return null

    return isIndented ? `@import '${importPath}'\n` : `@import '${importPath}';`
  }

  /**
   * Returns null when no injection is needed, or { code, map }.
   * The map only records the (constant) line shift of the injection:
   * zero lines for scss, one line for sass.
   */
  return (content, id, ctx) => {
    manager.refresh()

    // during dev, edits to the custom variables file must invalidate
    // every style module so that they pick up the fresh values
    if (typeof sassVariables === 'string' && ctx?.addWatchFile !== void 0) {
      ctx.addWatchFile(sassVariables)
    }

    const loadsFiles = contentLoadsFilesRegex.test(content)

    if (
      manager.canSkipInjection === true &&
      loadsFiles === false &&
      content.includes('$') === false
    ) {
      return null
    }

    let prefix = fullPrefix

    // content loading other files can propagate the injected variables
    // into them, so only self-contained content can get a targeted subset
    if (manager.graph !== null && loadsFiles === false) {
      const targetedPrefix = getTargetedPrefix(content)

      if (targetedPrefix === '') return null
      if (targetedPrefix !== null) prefix = targetedPrefix
    }

    const useIndex = Math.max(
      content.lastIndexOf('@use '),
      content.lastIndexOf('@forward ')
    )

    let insertAt = 0

    if (useIndex !== -1) {
      const newLineIndex = content.indexOf('\n', useIndex)
      insertAt = newLineIndex !== -1 ? newLineIndex + 1 : content.length + 1
    }

    const insertedLines = isIndented ? 1 : 0

    if (insertAt > content.length) {
      // single-line content ending in @use/@forward without a newline
      return {
        code: content + '\n' + prefix,
        map: null
      }
    }

    const insertLine =
      insertAt === 0 ? 0 : content.slice(0, insertAt).split('\n').length - 1

    return {
      code: content.slice(0, insertAt) + prefix + content.slice(insertAt),
      map:
        insertedLines === 0
          ? null
          : lineShiftMap(id, content, insertLine, insertedLines)
    }
  }
}
