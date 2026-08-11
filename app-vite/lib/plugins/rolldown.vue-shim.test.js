import { describe, expect, test } from 'vitest'

import { quasarRolldownVueShimPlugin } from './rolldown.vue-shim.js'

describe('[rolldown.vue-shim.js]', () => {
  const plugin = quasarRolldownVueShimPlugin()

  test('only handles .vue files', () => {
    expect(plugin.load.filter.id.test('src/App.vue')).toBe(true)
    expect(plugin.load.filter.id.test('src/app.js')).toBe(false)
  })

  test('shims .vue files with an empty module', () => {
    expect(plugin.load.handler()).toEqual({
      code: '',
      map: { mappings: '' }
    })
  })
})
