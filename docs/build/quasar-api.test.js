import { expect, test } from 'vitest'

import apiList from 'quasar/dist/transforms/api-list.json'

import { quasarApiVitePlugin } from './quasar-api.js'

const plugin = quasarApiVitePlugin()

test('resolves only the quasar:api virtual id', () => {
  // the rust-side filter gates the handler in production — a wrong
  // filter means the handler never runs at all
  expect(plugin.resolveId.filter.id.test('quasar:api')).toBe(true)
  expect(plugin.resolveId.filter.id.test('quasar:api-list')).toBe(false)

  expect(plugin.resolveId.handler('quasar:api')).toBe('\0quasar:api')
  expect(plugin.resolveId.handler('quasar:other')).toBeUndefined()
})

test('serves a lazy loader for every published API file', () => {
  expect(plugin.load.filter.id.test('\0quasar:api')).toBe(true)
  expect(plugin.load.filter.id.test('quasar:api')).toBe(false)

  const content = plugin.load.handler('\0quasar:api')

  expect(apiList.length).toBeGreaterThan(0)
  for (const entry of apiList) {
    expect(content).toContain(
      `export const ${entry} = () => import('quasar/dist/api/${entry}.json')`
    )
  }

  expect(plugin.load.handler('other')).toBeUndefined()
})
