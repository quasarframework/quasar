import { expect, test } from 'vitest'
import { join } from 'node:path'

import {
  listApi,
  readApi,
  readApiMarkdown,
  resolveApiName,
  similarApiNames
} from './api.js'
import { loadProject } from './project.js'
import { createProject } from './test/fixture.js'

function apiDir() {
  return loadProject(createProject()).packages[0].apiDir
}

test('lists the descriptors', () => {
  expect(listApi(apiDir())).toEqual(['Notify', 'QBtn'])
})

test('resolves names case-insensitively and without the Q prefix', () => {
  const dir = apiDir()
  for (const input of ['QBtn', 'qbtn', 'btn', 'Btn ']) {
    expect(resolveApiName(dir, input), input).toBe('QBtn')
  }
  expect(resolveApiName(dir, 'notify')).toBe('Notify')
  expect(resolveApiName(dir, 'QTable')).toBeNull()
})

test('reads a descriptor once', () => {
  const dir = apiDir()
  const api = readApi(dir, 'QBtn')
  expect(api.type).toBe('component')
  expect(Object.keys(api.props)).toEqual(['label', 'loading'])
  expect(readApi(dir, 'QBtn')).toBe(api)
  expect(readApi(dir, 'Missing')).toBeNull()
})

test('suggests names containing the input', () => {
  const dir = apiDir()
  expect(similarApiNames(dir, 'bt')).toEqual(['QBtn'])
  expect(similarApiNames(dir, 'qnot')).toEqual(['Notify'])
  expect(similarApiNames(dir, 'table')).toEqual([])
})

test('the rendered form comes whole, by part (both slot sections), or not at all', () => {
  const docsDir = join(loadProject(createProject()).packages[0].dir, 'dist/mcp')
  const whole = readApiMarkdown(docsDir, 'QBtn')
  expect(whole.startsWith('## QBtn API\n\n### Props\n')).toBe(true)
  expect(readApiMarkdown(docsDir, 'QBtn', 'props')).toBe(
    '### Props\n\n- `label` (string | number, optional)\n  The text that will be shown on the button\n- `loading` (boolean, optional)\n  Put button into loading state\n'
  )
  expect(readApiMarkdown(docsDir, 'QBtn', 'slots')).toBe(
    '### Slots\n\n- `default`\n  Default slot\n\n### Scoped Slots\n\n- `loading`\n  Override the default QSpinner\n'
  )
  expect(readApiMarkdown(docsDir, 'Notify', 'quasarConfOptions')).toContain(
    '### quasar.config.js Options'
  )
  expect(readApiMarkdown(docsDir, 'QBtn', 'methods')).toBe(null)
  expect(readApiMarkdown(docsDir, 'QNope')).toBe(null)
  const bare = join(
    loadProject(createProject({ apiMarkdown: false })).packages[0].dir,
    'dist/mcp'
  )
  expect(readApiMarkdown(bare, 'QBtn')).toBe(null)
})
