import { createSSRApp } from 'vue'
import { describe, expect, test } from 'vitest'

// resolves through the package self-reference ("node" export
// condition) to dist/quasar.server.prod.js, exactly what a Node test
// runner (Vitest, jsdom) loads when nothing aliases the package
import { Quasar } from 'quasar'

const App = { template: '<div>{{ $q.version }}</div>' }

describe('[Server bundle] install', () => {
  test('fills the ssrContext of an SSR app', () => {
    const ssrContext = { req: { headers: {}, url: '/' }, res: {} }

    createSSRApp(App).use(Quasar, {}, ssrContext)

    expect(ssrContext.$q).toMatchObject({
      version: expect.stringMatching(/^\d+\.\d+\.\d+/)
    })
    expect(ssrContext._meta).toBeTypeOf('object')
  })

  test('without an ssrContext throws an actionable error', () => {
    expect(() => createSSRApp(App).use(Quasar)).toThrow(
      /ssrContext.*quasar\/dist\/quasar\.client\.js.*@quasar\/vite-plugin/
    )
  })
})
