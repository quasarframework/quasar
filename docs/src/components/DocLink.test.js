import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocLink from './DocLink.vue'

test('renders internal targets as router links', async () => {
  const html = await renderComponent(
    DocLink,
    { to: '/vue-components/button' },
    () => 'Button'
  )

  expect(html).toContain('href="/vue-components/button"')
  expect(html).toContain('Button')
  // internal links navigate in-app: no new-tab escape, no launch icon
  expect(html).not.toContain('target="_blank"')
  expect(html).not.toContain('q-icon')
})

test('renders external targets as new-tab anchors with the launch icon', async () => {
  const html = await renderComponent(
    DocLink,
    { to: 'https://vuejs.org' },
    () => 'Vue'
  )

  expect(html).toContain('href="https://vuejs.org"')
  expect(html).toContain('target="_blank"')
  expect(html).toContain('rel="noopener"')
  expect(html).toContain('q-icon')
})
