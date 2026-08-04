import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { quasarPath } from './quasar-path.js'

const declRegex = /^\$([\w-]+)\s*:\s*(.*)$/
const useSassBuiltinRegex = /^@use\s+(['"])sass:([\w-]+)\1\s*;?$/
const varRefRegex = /\$([\w-]+)/g
const blockCommentRegex = /\/\*[\s\S]*?\*\//g

function stripLineComment(line) {
  let quote = null

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (quote !== null) {
      if (char === '\\') i++
      else if (char === quote) quote = null
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '/' && line[i + 1] === '/') {
      return line.slice(0, i)
    }
  }

  return line
}

/**
 * Bracket balance of a declaration value, ignoring quoted strings.
 * Returns NaN for an unterminated string, which makes every
 * comparison fail and so bails out the parser.
 */
function bracketBalance(str) {
  let balance = 0
  let quote = null

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (quote !== null) {
      if (char === '\\') i++
      else if (char === quote) quote = null
    } else if (char === '"' || char === "'") {
      quote = char
    } else if (char === '(' || char === '[') {
      balance++
    } else if (char === ')' || char === ']') {
      balance--
    }
  }

  return quote !== null ? Number.NaN : balance
}

/**
 * Parses a variables file into "@use sass:*" namespaces and a flat list
 * of variable declarations. Returns null when anything else is
 * encountered, so that the caller can fall back to full injection.
 * Handles both syntaxes: indented (single-line declarations) and scss
 * (multi-line values are folded into one line, which stays valid in
 * both syntaxes since values are whitespace-insensitive).
 *
 * Also used by the Quasar UI build to precompute
 * dist/transforms/sass-variables.json.
 */
export function parseVariablesFile(text) {
  const uses = []
  const decls = []
  const lines = text.replace(blockCommentRegex, ' ').split('\n')

  for (let i = 0; i < lines.length; i++) {
    const line = stripLineComment(lines[i]).trim()
    if (line === '') continue

    const useMatch = useSassBuiltinRegex.exec(line)
    if (useMatch !== null) {
      uses.push(useMatch[2])
      continue
    }

    const declMatch = declRegex.exec(line)
    if (declMatch === null) return null

    let value = declMatch[2]
    while (bracketBalance(value) > 0) {
      if (++i >= lines.length) return null
      value += ' ' + stripLineComment(lines[i]).trim()
    }
    if (bracketBalance(value) !== 0) return null

    value = value.trim()
    if (value.endsWith(';')) {
      value = value.slice(0, -1).trim()
    }
    if (value === '') return null

    decls.push({ name: declMatch[1], value })
  }

  return { uses, decls }
}

let precomputedQuasarVariables

/**
 * The Quasar UI build precomputes the parse of its own variables file
 * into dist/transforms/sass-variables.json. Returns null when the file
 * is absent (older Quasar version) or does not match the expected
 * format, in which case the variables file gets parsed at runtime.
 */
export function loadPrecomputedQuasarVariables() {
  if (precomputedQuasarVariables !== void 0) {
    return precomputedQuasarVariables
  }

  precomputedQuasarVariables = null

  try {
    const data = JSON.parse(
      readFileSync(
        join(quasarPath, 'dist/transforms/sass-variables.json'),
        'utf8'
      )
    )

    if (
      Array.isArray(data.uses) &&
      data.uses.every(ns => typeof ns === 'string') &&
      Array.isArray(data.declarations) &&
      data.declarations.every(
        decl => typeof decl.name === 'string' && typeof decl.value === 'string'
      )
    ) {
      precomputedQuasarVariables = {
        uses: data.uses,
        decls: data.declarations
      }
    }
  } catch {
    // keep the runtime parsing fallback
  }

  return precomputedQuasarVariables
}

/**
 * Builds a dependency graph of all variable declarations from the
 * injected files (custom variables file first, then Quasar's, mirroring
 * the injection order). Quasar's own declarations come exclusively from
 * the precomputed parse shipped in its dist (guaranteed by the peer
 * dependency floor). Returns null when unavailable or when the custom
 * file cannot be confidently parsed as declarations-only, in which
 * case full injection is used.
 */
export function buildVariablesGraph(sassVariables) {
  const quasarParsed = loadPrecomputedQuasarVariables()
  if (quasarParsed === null) return null

  const namespaces = new Set()
  const entries = []

  if (typeof sassVariables === 'string') {
    let parsed
    try {
      parsed = parseVariablesFile(readFileSync(sassVariables, 'utf8'))
    } catch {
      return null
    }
    if (parsed === null) return null

    for (const ns of parsed.uses) namespaces.add(ns)
    entries.push(...parsed.decls)
  }

  for (const ns of quasarParsed.uses) namespaces.add(ns)
  // copies, since the entries get augmented below and the
  // precomputed declarations are a shared, cached structure
  entries.push(
    ...quasarParsed.decls.map(decl => ({
      name: decl.name,
      value: decl.value
    }))
  )

  const byName = new Map()
  const nsRefRegex =
    namespaces.size !== 0
      ? new RegExp(`\\b(?:${[...namespaces].join('|')})\\.`)
      : null

  entries.forEach((entry, index) => {
    entry.deps = [...entry.value.matchAll(varRefRegex)].map(m => m[1])
    entry.usesNamespace = nsRefRegex !== null && nsRefRegex.test(entry.value)
    entry.text = `$${entry.name}: ${entry.value}`

    const indexList = byName.get(entry.name)
    if (indexList !== void 0) indexList.push(index)
    else byName.set(entry.name, [index])
  })

  return { entries, byName, namespaces: [...namespaces] }
}

/**
 * Resolves the transitive closure of the given variable names.
 * Unknown names are ignored (they are either defined by the style
 * content itself or produce the same sass error full injection would).
 * The returned declarations keep their original file order, which is
 * exactly the order full injection would evaluate them in.
 */
export function resolveVariablesClosure(graph, refNames) {
  const included = new Set()
  const visited = new Set()
  const pending = [...refNames]
  let usesNamespace = false

  while (pending.length !== 0) {
    const name = pending.pop()
    if (visited.has(name)) continue
    visited.add(name)

    const indexList = graph.byName.get(name)
    if (indexList === void 0) continue

    for (const index of indexList) {
      included.add(index)
      const entry = graph.entries[index]

      if (entry.usesNamespace === true) {
        usesNamespace = true
      }
      for (const dep of entry.deps) {
        if (visited.has(dep) === false) {
          pending.push(dep)
        }
      }
    }
  }

  return {
    declarations: [...included]
      .sort((a, b) => a - b)
      .map(i => graph.entries[i].text),
    usesNamespace
  }
}
