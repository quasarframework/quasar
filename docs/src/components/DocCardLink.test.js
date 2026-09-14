import { expect, test } from 'vitest'

import { renderComponent } from '../../test/render.js'

import DocCardLink from './DocCardLink.vue'

test('renders in-app cards as router links', async () => {
  const html = await renderComponent(DocCardLink, {
    to: '/style/typography',
    label: 'Typography',
    icon: 'text_fields'
  })

  expect(html).toContain('href="/style/typography"')
  expect(html).toContain('class="doc-card-link"')
  expect(html).not.toContain('target="_blank"')
  expect(html).toContain('>Typography<')
  expect(html).toContain('text_fields')
  // the default icon color
  expect(html).toContain('text-brand-primary')
})

test('renders hash targets as router links too', async () => {
  const html = await renderComponent(DocCardLink, {
    to: '#sponsors',
    label: 'Sponsors',
    icon: 'stars'
  })

  // resolved by the router against the current route
  expect(html).toContain('href="/#sponsors"')
  expect(html).toContain('router-link-active')
  expect(html).not.toContain('target="_blank"')
})

test('renders external cards as new-tab anchors', async () => {
  const html = await renderComponent(DocCardLink, {
    to: 'https://quasar.dev',
    label: 'Site',
    icon: 'launch',
    iconColor: 'brand-accent'
  })

  expect(html).toContain('href="https://quasar.dev"')
  expect(html).toContain('target="_blank"')
  expect(html).toContain('>Site<')
  expect(html).toContain('text-brand-accent')
  expect(html).not.toContain('text-brand-primary')
})
