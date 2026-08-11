import { h } from 'vue'
import { expect, test } from 'vitest'

import { QTabPanel } from 'quasar'

import { renderComponent } from '../../test/render.js'

import DocPrerender from './DocPrerender.js'

test('renders title and content directly without tabs', async () => {
  const html = await renderComponent(
    DocPrerender,
    { title: 'Plain card' },
    () => h('div', 'Card body')
  )

  expect(html).toContain('Plain card')
  expect(html).toContain('Card body')
})

test('renders tab headers and the active panel', async () => {
  const html = await renderComponent(
    DocPrerender,
    { tabs: ['Yarn', 'NPM'] },
    () => [
      h(QTabPanel, { name: 'Yarn' }, () => 'yarn add quasar'),
      h(QTabPanel, { name: 'NPM' }, () => 'npm install quasar')
    ]
  )

  expect(html).toContain('Yarn')
  expect(html).toContain('NPM')
  // the first tab is active; only its panel is rendered
  expect(html).toContain('yarn add quasar')
  expect(html).not.toContain('npm install quasar')
})
