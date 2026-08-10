import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocCardLink from './DocCardLink.vue'

test('renders in-app cards as router links', async () => {
  const html = await renderComponent(
    DocCardLink,
    { to: '/style/typography' },
    () => 'Typography'
  )

  expect(html).toContain('href="/style/typography"')
  expect(html).toContain('class="card-link"')
  expect(html).not.toContain('target="_blank"')
})

test('renders external cards as new-tab anchors', async () => {
  const html = await renderComponent(
    DocCardLink,
    { to: 'https://quasar.dev', external: true },
    () => 'Site'
  )

  expect(html).toContain('href="https://quasar.dev"')
  expect(html).toContain('target="_blank"')
})
