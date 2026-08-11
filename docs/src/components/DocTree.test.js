import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocTree from './DocTree.vue'

test('renders the expanded tree, marking parents with a trailing slash', async () => {
  const html = await renderComponent(DocTree, {
    def: { l: 'src', c: [{ l: 'components', c: [{ l: 'App.vue' }] }] }
  })

  // doc trees render fully expanded; parents get a "/" suffix,
  // leaves stay bare
  expect(html).toContain('src/')
  expect(html).toContain('components/')
  expect(html).toContain('App.vue')
  expect(html).not.toContain('App.vue/')
})
