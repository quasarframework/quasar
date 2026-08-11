import { expect, test } from 'vitest'
import { join, normalize } from 'node:path'
import { globSync } from 'tinyglobby'

import { codeSplitting, examplesVitePlugin } from './prod-chunks.js'

const examplesRoot = normalize(join(import.meta.dirname, '../src/examples'))

// same derivation the plugin itself performs
const [sampleDir] = globSync('*', {
  cwd: examplesRoot,
  onlyDirectories: true
})
const sampleId = sampleDir.slice(0, -1)
const sampleFiles = globSync('**/*.vue', { cwd: examplesRoot })
  .filter(file => file.startsWith(sampleDir))
  .map(entry => entry.slice(sampleDir.length, -4))

test('is a prod-only plugin', () => {
  expect(examplesVitePlugin(false)).toBeNull()
})

test('resolves only the examples virtual ids', () => {
  const plugin = examplesVitePlugin(true)

  // the rust-side filter gates the handler in production — a wrong
  // filter means the handler never runs at all
  expect(plugin.resolveId.filter.id.test(`examples:runtime:${sampleId}`)).toBe(
    true
  )
  expect(plugin.resolveId.filter.id.test('something-else')).toBe(false)

  expect(plugin.resolveId.handler(`examples:runtime:${sampleId}`)).toBe(
    `\0examples:runtime:${sampleId}`
  )
  expect(plugin.resolveId.handler('something-else')).toBeUndefined()
})

test('emits an export per example file, raw for the source variant', () => {
  const plugin = examplesVitePlugin(true)

  expect(plugin.load.filter.id.test(`\0examples:runtime:${sampleId}`)).toBe(
    true
  )
  expect(plugin.load.filter.id.test(`examples:runtime:${sampleId}`)).toBe(false)

  const runtime = plugin.load.handler(`\0examples:runtime:${sampleId}`)
  const source = plugin.load.handler(`\0examples:source:${sampleId}`)

  expect(sampleFiles.length).toBeGreaterThan(0)
  for (const entry of sampleFiles) {
    expect(runtime).toContain(
      `export { default as ${entry} } from '@/examples/${sampleId}/${entry}.vue'`
    )
    expect(source).toContain(
      `export { default as ${entry} } from '@/examples/${sampleId}/${entry}.vue?raw'`
    )
  }
})

test('groups the framework and example chunks', () => {
  const vendor = codeSplitting.groups.find(group => group.name === 'v')
  expect(vendor.test.test('node_modules/vue/dist/vue.runtime.mjs')).toBe(true)

  const runtimeGroup = codeSplitting.groups.find(
    group =>
      typeof group.name === 'function' &&
      group.test.test('\0examples:runtime:x')
  )
  expect(runtimeGroup.name(`\0examples:runtime:${sampleId}`)).toBe(
    `${sampleId}.r`
  )
})
