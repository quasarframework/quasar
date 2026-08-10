import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocCardTitle from './DocCardTitle.vue'

test('derives its anchor id from the slugified title', async () => {
  const html = await renderComponent(DocCardTitle, { title: 'Basic Usage' })

  expect(html).toContain('id="basic-usage"')
  expect(html).toContain('Basic Usage')
})

test('prepends the prefix to the anchor id', async () => {
  const html = await renderComponent(DocCardTitle, {
    title: 'Standard',
    prefix: 'example--'
  })

  expect(html).toContain('id="example--standard"')
})
