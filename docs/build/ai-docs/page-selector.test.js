import { expect, test } from 'vitest'
import { selectPages } from './page-selector.js'

const menuByKey = new Map([
  ['vue-components/knob', { title: 'Knob' }],
  [
    'quasar-cli-vite/page-routing-with-vue-router',
    { title: 'Page Routing with Vue Router' }
  ]
])

test('returns intersection of glob and menu', () => {
  const globbed = [
    'vue-components/knob.md',
    'quasar-cli-vite/page-routing-with-vue-router.md',
    'quasar-cli-webpack/zombie.md'
  ]
  const { included, orphans, missing } = selectPages(globbed, menuByKey)
  expect(included.sort()).toStrictEqual([
    'quasar-cli-vite/page-routing-with-vue-router.md',
    'vue-components/knob.md'
  ])
  expect(orphans).toStrictEqual(['quasar-cli-webpack/zombie.md'])
  expect(missing).toStrictEqual([])
})

test('reports missing pages (in menu but not on disk)', () => {
  const globbed = ['vue-components/knob.md'] // routing missing
  const { included, orphans, missing } = selectPages(globbed, menuByKey)
  expect(included).toStrictEqual(['vue-components/knob.md'])
  expect(orphans).toStrictEqual([])
  expect(missing).toStrictEqual([
    'quasar-cli-vite/page-routing-with-vue-router'
  ])
})
