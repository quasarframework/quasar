import { expect, test } from 'vitest'

import { DOCS_FORMAT, buildMeta } from './meta.js'

test('lists the format, the package, its version and the pages sorted by route', () => {
  const meta = JSON.parse(
    buildMeta({
      packageName: 'quasar',
      version: '2.33.0',
      pages: [
        { route: 'vue-components/button', title: 'Button', desc: 'Buttons' },
        { route: 'layout/drawer', title: 'Drawer', desc: null }
      ]
    })
  )
  expect(DOCS_FORMAT).toBe(1)
  expect(meta).toEqual({
    format: DOCS_FORMAT,
    package: 'quasar',
    version: '2.33.0',
    pages: [
      { route: 'layout/drawer', title: 'Drawer', desc: null },
      { route: 'vue-components/button', title: 'Button', desc: 'Buttons' }
    ]
  })
})
