import { describe, expect, test } from 'vitest'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import {
  buildVariablesGraph,
  loadPrecomputedQuasarVariables,
  parseVariablesFile,
  resolveVariablesClosure
} from '../../../src/sass-variables-graph.js'
import { quasarPath } from '../../../src/quasar-path.js'

const tmpDir = mkdtempSync(join(tmpdir(), 'quasar-vars-'))

function writeVarsFile(name, content) {
  const file = join(tmpDir, name)
  writeFileSync(file, content)
  return file
}

describe('precomputed quasar variables', () => {
  test('the shipped file exists and is used', () => {
    expect(loadPrecomputedQuasarVariables()).not.toBeNull()
  })

  test('the shipped file matches a live parse of variables.sass', () => {
    const precomputed = loadPrecomputedQuasarVariables()
    const live = parseVariablesFile(
      readFileSync(join(quasarPath, 'src/css/variables.sass'), 'utf8')
    )

    expect(live).not.toBeNull()
    expect(precomputed.uses).toStrictEqual(live.uses)
    expect(precomputed.decls).toStrictEqual(
      live.decls.map(({ name, value }) => ({ name, value }))
    )
  })
})

describe('sass variables graph', () => {
  test('builds a graph from the quasar variables file', () => {
    const graph = buildVariablesGraph(true)

    expect(graph).not.toBeNull()
    expect(graph.byName.has('space-base')).toBe(true)
    expect(graph.namespaces).toContain('map')
  })

  test('closure includes transitive dependencies in file order', () => {
    const graph = buildVariablesGraph(true)
    const { declarations } = resolveVariablesClosure(
      graph,
      new Set(['flex-gutter-sm'])
    )

    const baseIndex = declarations.findIndex(d => d.startsWith('$space-base:'))
    const gutterIndex = declarations.findIndex(d =>
      d.startsWith('$flex-gutter-sm:')
    )

    expect(baseIndex).not.toBe(-1)
    expect(gutterIndex).not.toBe(-1)
    expect(baseIndex).toBeLessThan(gutterIndex)
  })

  test('closure flags namespace usage for breakpoint variables', () => {
    const graph = buildVariablesGraph(true)
    const { declarations, usesNamespace } = resolveVariablesClosure(
      graph,
      new Set(['breakpoint-sm-min'])
    )

    expect(usesNamespace).toBe(true)
    expect(declarations.some(d => d.startsWith('$sizes:'))).toBe(true)
  })

  test('unknown names resolve to an empty closure', () => {
    const graph = buildVariablesGraph(true)
    const { declarations } = resolveVariablesClosure(
      graph,
      new Set(['my-local-only-var'])
    )

    expect(declarations.length).toBe(0)
  })

  test('custom file declarations come before quasar ones', () => {
    const file = writeVarsFile('custom.sass', '$primary: #388310\n')
    const graph = buildVariablesGraph(file)
    const { declarations } = resolveVariablesClosure(
      graph,
      new Set(['primary'])
    )

    expect(declarations[0]).toBe('$primary: #388310')
    expect(declarations[1]).toMatch(/^\$primary: .+ !default$/)
  })

  test('parses multi-line scss map values', () => {
    const file = writeVarsFile(
      'multiline.scss',
      '$my-map: (\n  a: $space-base,\n  b: 2px\n);\n'
    )
    const graph = buildVariablesGraph(file)

    expect(graph).not.toBeNull()
    const { declarations } = resolveVariablesClosure(graph, new Set(['my-map']))
    expect(declarations.some(d => d.startsWith('$my-map: ('))).toBe(true)
    expect(declarations.some(d => d.startsWith('$space-base:'))).toBe(true)
  })

  test('bails out on non-declaration constructs', () => {
    const file = writeVarsFile('mixin.scss', '@debug "hi";\n$a: 1;\n')
    expect(buildVariablesGraph(file)).toBeNull()
  })
})

describe('closure resolution for injection', () => {
  const graph = buildVariablesGraph(true)

  test('closure keeps declaration order and transitive deps', () => {
    const { declarations, usesNamespace } = resolveVariablesClosure(
      graph,
      new Set(['flex-gutter-sm'])
    )

    expect(usesNamespace).toBe(false)
    expect(declarations[0]).toMatch(/^\$space-base:/)
    expect(declarations.at(-1)).toMatch(/^\$flex-gutter-sm:/)
  })

  test('breakpoint closure flags the sass:map namespace', () => {
    const { declarations, usesNamespace } = resolveVariablesClosure(
      graph,
      new Set(['breakpoint-sm-min'])
    )

    expect(usesNamespace).toBe(true)
    expect(declarations.some(d => d.startsWith('$sizes:'))).toBe(true)
  })
})
