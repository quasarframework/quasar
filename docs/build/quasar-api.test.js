import { expect, test } from 'vitest'

import apiList from 'quasar/dist/transforms/api-list.json'

import { quasarApiVitePlugin } from './quasar-api.js'

const plugin = quasarApiVitePlugin()

test('resolves only the quasar:api virtual id', () => {
  expect(plugin.resolveId('quasar:api')).toBe('\0quasar:api')
  expect(plugin.resolveId('quasar:other')).toBeUndefined()
})

test('serves a lazy loader for every published API file', () => {
  const content = plugin.load('\0quasar:api')

  expect(apiList.length).toBeGreaterThan(0)
  for (const entry of apiList) {
    expect(content).toContain(
      `export const ${entry} = () => import('quasar/dist/api/${entry}.json')`
    )
  }

  expect(plugin.load('other')).toBeUndefined()
})
