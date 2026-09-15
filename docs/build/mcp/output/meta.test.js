import { expect, test } from 'vitest'

import { buildMeta } from './meta.js'

test('lists the package, its version and the pages sorted by route', () => {
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
  expect(meta).toEqual({
    package: 'quasar',
    version: '2.33.0',
    pages: [
      { route: 'layout/drawer', title: 'Drawer', desc: null },
      { route: 'vue-components/button', title: 'Button', desc: 'Buttons' }
    ]
  })
})
